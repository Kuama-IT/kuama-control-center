import DipendentiInClountReport from "@/modules/dipendenti-in-cloud/components/dipendenti-in-cloud-report";

export default async function Page({
  params,
}: {
  params: Promise<{ credentialsId: string }>;
}) {
  const credentialsId = (await params).credentialsId;

  const mockUsers = [
    {
      id: 1,
      name: "Mario",
      surname: "Rossi",
      cFisc: "RSSMRA00A01F205X",
      dailyHours: [
        0, 0, 10, 4, 9, 6, 8, 0, 0, 8, 8, 4, 5, 9, 0, 0, 7, 8, 8, 8, 8, 0, 0, 1,
        12, 4, 8, 8, 0, 0, 6,
      ],
    },
    {
      id: 2,
      name: "Luigi",
      surname: "Bianchi",
      cFisc: "BNCLGU00A01F205X",
      dailyHours: [
        0, 0, 6, 2, 7, 9, 8, 0, 0, 8, 8, 8, 8, 8, 0, 0, 9, 8, 7, 8, 8, 0, 0, 8,
        8, 8, 8, 8, 0, 0, 6,
      ],
    },
  ];

  const additionalUsers = Array.from({ length: 15 }, (_, index) => ({
    ...mockUsers[1],
    id: mockUsers[1].id + index + 1, // Incrementa l'id partendo da 3
  }));

  const longerMockUsers = [...mockUsers, ...additionalUsers];

  return (
    <DipendentiInClountReport
      credentialsId={credentialsId}
      month={3} // Marzo
      year={2025}
      users={longerMockUsers}
    />
  );
}
