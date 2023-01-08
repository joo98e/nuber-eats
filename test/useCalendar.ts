import { useState } from "react";
import moment, { Moment } from "moment/moment";
import "moment/locale/ko";
import { GetWeeksInfoResult, WeeksInfo } from "./types";

moment.locale("ko");

export default function useCalendar() {
  const [getMoment, setMoment] = useState<Moment>(moment());

  function getFormat(format: string) {
    return getMoment.format(format);
  }

  function getWeeksInfo(): GetWeeksInfoResult {
    const result: GetWeeksInfoResult = {
      currentYear: getMoment.year(),
      currentMonth: getMoment.month() + 1,
      weeks: [],
    };

    const startWeekNum = getMoment.clone().startOf("month").week();
    const endWeekNum = getMoment.clone().endOf("month").week() === 1 ? 53 : getMoment.clone().endOf("month").week();

    for (let currentWeekNum = startWeekNum; currentWeekNum <= endWeekNum; currentWeekNum++) {
      const currentWeekInfos: WeeksInfo = Array(7)
        .fill(0)
        .map((data, index) => {
          const days = getMoment.clone().startOf("year").week(currentWeekNum).startOf("week").add(index, "day");
          return {
            d: days.format("dddd"),
            D: Number(days.format("D")),
          };
        });

      result.weeks.push(currentWeekInfos);
    }

    return result;
  }

  function handleClickPrevMonth() {}

  function handleClickNextMonth() {}

  return {
    getMoment: getMoment,
    setMoment: setMoment,
    getFormat: getFormat,
    getWeeksInfo: getWeeksInfo,
    handleClickPrevMonth: handleClickPrevMonth,
    handleClickNextMonth: handleClickNextMonth,
  };
}
