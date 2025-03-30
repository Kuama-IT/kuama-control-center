import kAbsenceDaysList from "@/modules/k-absence-days/actions/k-absence-days-list";
import kAbsenceReasonsList from "@/modules/k-absence-days/actions/k-absence-reasons-list";
import kClosuresList from "@/modules/k-absence-days/actions/k-closures-list";

export const kAbsenceDaysServer = {
  list: kAbsenceDaysList,
  listReasons: kAbsenceReasonsList,
  closures: kClosuresList, // TODO not the best place for this
};
