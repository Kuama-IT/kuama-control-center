import kAbsenceDaysList from "@/modules/k-absence-days/actions/k-absence-days-list";
import kAbsenceReasonsList from "@/modules/k-absence-days/actions/k-absence-reasons-list";

export const kAbsenceDaysServer = {
  list: kAbsenceDaysList,
  listReasons: kAbsenceReasonsList,
};
