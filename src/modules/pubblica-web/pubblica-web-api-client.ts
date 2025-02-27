import {
  documentsResponseSchema,
  folderTreeResponseSchema,
  PubblicaWebAuthenticationResponse,
  pubblicaWebAuthenticationResponseSchema,
  repositoriesResponseSchema,
} from "@/modules/pubblica-web/schemas/pubblica-web-schemas";
import { firstOrThrow } from "@/utils/array-utils";

export class PubblicaWebApi {
  private readonly baseAuthUrl =
    "https://sv23.cloudserverds.it/pubblicaweb/studiobortoletto/api/v1/";

  private readonly baseUrl =
    "https://sv23.cloudserverds.it/pubblicaweb/studiobortoletto/api/v2/";

  private readonly baseDocumentsUrl =
    "https://sv23.cloudserverds.it/pubblicaweb/studiobortoletto/api/";
  private authenticationToken: string | undefined;

  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}

  private get authenticationHeaders() {
    return {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": this.authenticationToken ?? "",
      },
    };
  }

  /**
   * Authenticates against Account endpoint and stores received cookies for further requests.
   */
  async authenticate(): Promise<PubblicaWebAuthenticationResponse> {
    const response = await fetch(`${this.baseAuthUrl}Account`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        Username: this.username,
        Password: this.password,
        SourceType: "spa",
        TwoFactorEnabled: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Authentication failed");
    }

    const responseBody = await response.json();
    const parsed = pubblicaWebAuthenticationResponseSchema.parse(responseBody);
    this.authenticationToken = parsed.AuthToken;
    return parsed;
  }

  /**
   * Fetches all payslips for a given employee. Months count from 01 to 13 (december has 2 payslips).
   * .
   * ├── EMPLOYEE FULL NAME/
   * │   ├── Cedolino-YYYY-MM-0000.pdf
   * │   └── ...
   * └── ..../
   *     └── ...
   * @param fullName Employee full name uppercased
   */
  async fetchPayslipsForEmployee(fullName: string) {
    const repository = await this.getDefaultRepository();

    const folderTree = await this.readFolderTreeAtPath(repository.Id);
    // Our consultant has created (idk why) multiple folders for some of us...
    const employeeFolderItems = folderTree.filter(
      (item) => item.text === fullName,
    );

    if (!employeeFolderItems.length) {
      throw new Error(`Employee ${fullName} not found in folder tree`);
    }

    const allPayslips: { bytes: any; mimeType: string; name: string }[] = [];
    for (const employeeFolderItem of employeeFolderItems) {
      const documents = await this.readDocumentsAtPath(
        repository.Id,
        employeeFolderItem.data.path,
      );

      const payslips = documents.filter((document) =>
        document.Name.toLowerCase().startsWith("cedolino-"),
      );

      const payslipsBuffer = await Promise.all(
        payslips.map((payslip) => this.downloadDocument(payslip.Id)),
      );

      allPayslips.push(
        ...payslips.map((payslip, index) => ({
          bytes: payslipsBuffer[index],
          mimeType: payslip.MimeType,
          name: payslip.Name,
        })),
      );
    }

    return allPayslips;
  }

  /**
   * Fetches a single document that contains all employees payslips for a given yearAndMonth.
   * Documents inside PubblicaWeb are organized this way:
   * .
   * ├── 2021/
   * │   ├── 2021-01/
   * │   │   └── LUL-2021-01.pdf <- this is the document we want to fetch
   * │   ├── 2021-02
   * │   └── ...
   * └── 2022/
   *     └── ...
   * @param yearAndMonth
   */
  async fetchPayslips(yearAndMonth: Date) {
    const year = yearAndMonth.getFullYear();
    const monthNumber = yearAndMonth.getMonth() + 1;
    const formattedMonth = `${year}-${monthNumber.toString().padStart(2, "0")}`;

    const repository = await this.getDefaultRepository();

    const folderTree = await this.readFolderTreeAtPath(repository.Id);
    const folderTreeYearItem = folderTree.find(
      (item) => item.text === year.toString(),
    );

    if (!folderTreeYearItem) {
      throw new Error("Year not found in folder tree");
    }

    const yearFolderTree = await this.readFolderTreeAtPath(
      repository.Id,
      folderTreeYearItem.data.path,
    );

    const monthFolderTreeItem = yearFolderTree.find(
      (item) => item.text === formattedMonth,
    );
    if (!monthFolderTreeItem) {
      throw new Error("Month not found in folder tree");
    }
    const documents = await this.readDocumentsAtPath(
      repository.Id,
      monthFolderTreeItem.data.path,
    );

    const allPaySlipsDocuments = documents.filter((document) =>
      document.Name.toLowerCase().startsWith("lul-"),
    );

    const allPaySlipsDocument = firstOrThrow(allPaySlipsDocuments);

    const buffer = await this.downloadDocument(allPaySlipsDocument.Id);
    return {
      bytes: buffer,
      mimeType: allPaySlipsDocument.MimeType,
      name: allPaySlipsDocument.Name,
    };
  }

  private async readFolderTreeAtPath(
    repositoryId: number,
    path: string = "\\", // default to root
  ) {
    const response = await fetch(
      `${this.baseUrl}folderTree?${new URLSearchParams({ repositoryId: repositoryId.toString(), path, unread: true.toString() })}`,
      this.authenticationHeaders,
    );
    const responseBody = await response.json();
    return folderTreeResponseSchema.parse(responseBody);
  }

  private async readDocumentsAtPath(repositoryId: number, path: string = "\\") {
    const response = await fetch(
      `${this.baseUrl}documents?${new URLSearchParams({ repositoryId: repositoryId.toString(), path })}`,
      this.authenticationHeaders,
    );
    const responseBody = await response.json();
    return documentsResponseSchema.parse(responseBody);
  }

  private async downloadDocument(documentId: number) {
    const response = await fetch(
      `${this.baseDocumentsUrl}Documents?Id=${documentId}&SubjectId=`,
      this.authenticationHeaders,
    );
    return await response.bytes();
  }

  private async getDefaultRepository() {
    const repositoriesResponse = await fetch(
      `${this.baseUrl}repositories?SubjectId=`,
      this.authenticationHeaders,
    );

    const repositoriesResponseBody = await repositoriesResponse.json();
    const repositories = repositoriesResponseSchema.parse(
      repositoriesResponseBody,
    );

    return firstOrThrow(repositories);
  }
}
