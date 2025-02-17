import kProjectsAddImagesAction from "@/modules/k-projects/actions/k-projects-add-images-action";
import kProjectsByEmployee from "@/modules/k-projects/actions/k-projects-get-by-employee-action";

export const kProjectsServer = {
  addImages: kProjectsAddImagesAction,
  byEmployeeId: kProjectsByEmployee,
};
