import {
  Component,
  Prop,
  h,
  State,
  Event,
  EventEmitter,
  Watch,
} from '@stencil/core';

class CalendarEntry {
  day?: number;
  month: number;
  year: number;
}

class Calendar {
  readonly year: number;
  readonly month: number;
  readonly daysInCalendarWithFiveRows = 42;
  readonly daysInCalendarWithFourRows = 35;
  readonly daysInCalendarWithThreeRows = 28;

  public daysInCalendar = this.daysInCalendarWithFourRows;

  private fillStartCount = 0;
  private fillEndCount = 0;
  private currentMonthCount: number;
  private fillCount = [6, 0, 1, 2, 3, 4, 5];

  constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
  }

  public getCalendarDays(): number[] {
    const daysOfCurrentMonth = this.getDaysOfCurrentMonth();
    const fillStartCount = this.fillCount[this.getFirstDayOfMonth()];
    const fillEndCount =
      this.daysInCalendarWithFourRows -
      (daysOfCurrentMonth.length + fillStartCount);

    this.currentMonthCount = daysOfCurrentMonth.length;
    this.fillStartCount = fillStartCount;
    this.fillEndCount = fillEndCount;

    const fillStart =
      fillStartCount > 0 ? this.getDaysOfLastMonth(fillStartCount) : [];
    const fillEnd = this.getDaysOfNextMonth(fillEndCount);

    return fillStart.concat(daysOfCurrentMonth).concat(fillEnd);
  }

  private getDaysOfCurrentMonth(): number[] {
    return this.getDaysOfMonth(this.month);
  }

  private getDaysOfLastMonth(fillStartCount: number): number[] {
    const daysOfMonth = this.getDaysOfMonth(this.month - 1);
    return daysOfMonth.slice(-fillStartCount);
  }

  private getDaysOfNextMonth(endCount: number): number[] {
    const daysOfMonth = this.getDaysOfMonth(this.month + 1);

    let slicedDays;

    if (endCount <= -1) {
      endCount =
        this.daysInCalendarWithFiveRows -
        (this.currentMonthCount + this.fillStartCount);
      slicedDays = daysOfMonth.slice(0, endCount);
      this.daysInCalendar = this.daysInCalendarWithFiveRows;
      this.fillEndCount = endCount;
    } else if (
      endCount === 7 &&
      this.currentMonthCount + this.fillStartCount === 28
    ) {
      endCount =
        this.daysInCalendarWithThreeRows -
        (this.currentMonthCount + this.fillStartCount);
      slicedDays = daysOfMonth.slice(0, endCount);
      this.daysInCalendar = this.daysInCalendarWithThreeRows;
      this.fillEndCount = endCount;
    } else {
      slicedDays = daysOfMonth.slice(0, endCount);
    }

    return slicedDays;
  }

  private getDaysOfMonth(month: number): number[] {
    const daysOfMonth = new Date(this.year, month, 0).getDate();

    return Array.from({ length: daysOfMonth }, (_, i) => i + 1);
  }

  public getFirstDayOfMonth(): number {
    return new Date(this.year, this.month - 1, 1).getDay();
  }

  public getFillStartCount(): number {
    return this.fillStartCount;
  }

  public getFillEndCount(): number {
    return this.fillEndCount;
  }

  public static getToday(): CalendarEntry {
    const now = new Date();

    return {
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  }
}

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  @Prop() daysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  @Prop() monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  @Prop() showFillDays = true;
  @State() date = Calendar.getToday();
  @State() daysInMonth: number[];
  @State() selectedDate: CalendarEntry;
  @State() eventDates = [];

  private fillStartCount: number;
  private fillEndCount: number;
  readonly today: CalendarEntry;

  @Event({
    eventName: 'dayChanged',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  dayChanged: EventEmitter<CalendarEntry>;

  @Event({
    eventName: 'monthChanged',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  monthChanged: EventEmitter<CalendarEntry>;

  @Watch('date')
  watchDate(date: CalendarEntry): void {
    if ('month' in date && 'year' in date) {
      this.selectedDate = date;
    }
  }

  constructor() {
    this.today = Calendar.getToday();
  }

  conmponentWillLoad() {
    this.setCalendarDetails();
  }

  setCalendarDetails(): void {
    const date = this.getValidDate();
    const calendar = new Calendar(date.year, date.month);
    this.daysInMonth = calendar.getCalendarDays();
    this.fillStartCount = calendar.getFillStartCount();
    this.fillEndCount = calendar.daysInCalendar - calendar.getFillEndCount();
  }

  getValidDate(): CalendarEntry {
    let date = this.date;
    if (!('month' in date && 'year' in date)) {
      date = this.today;
    }

    return date;
  }

  dayChangedHandler(calendarEntry: CalendarEntry): void {
    this.dayChanged.emit(calendarEntry);
  }

  daySelectedHandler(day): void {
    this.selectedDate = {
      day,
      month: this.date.month,
      year: this.date.year,
    };

    this.dayChangedHandler(this.selectedDate);
  }

  monthChangedHandler(calendarEntry: CalendarEntry): void {
    this.monthChanged.emit(calendarEntry);
  }

  switchToPreviousMonth = (): void => {
    if (this.date.month !== 1) {
      this.date.month -= 1;
    } else {
      this.date.month = 12;
      this.date.year -= 1;
    }

    if (typeof this.date !== 'undefined') {
      delete this.date.day;
    }

    this.setCalendarDetails();
    this.monthChangedHandler(this.date);
  };

  switchToNextMonth = (): void => {
    if (this.date.month !== 12) {
      this.date.month += 1;
    } else {
      this.date.month = 1;
      this.date.year += 1;
    }

    delete this.date.day;

    this.setCalendarDetails();
    this.monthChangedHandler(this.date);
  };

  getDigitClassNames = (
    day: number,
    month: number,
    year: number,
    index: number
  ): string => {
    let classNameDigit = [];
    if (day.toString().length === 1) {
      classNameDigit.push('padding-single-digit');
    }

    if (this.isToday(day, month, year, index)) {
      classNameDigit.push('active');
    }

    if (this.isSelectedDay(day, index)) {
      classNameDigit.push('has-event');
    }

    return classNameDigit.join(' ');
  };

  isToday = (day: number, month: number, year: number, index: number) => {
    return (
      this.today.day === day &&
      this.today.month === month &&
      this.today.year === year &&
      !(index < this.fillStartCount || index >= this.fillEndCount)
    );
  };

  isSelectedDay(day: number, index: number) {
    return (
      typeof this.selectedDate !== 'undefined' &&
      this.selectedDate.day === day &&
      this.selectedDate.month === this.date.month &&
      this.selectedDate.year === this.date.year &&
      !(index < this.fillStartCount || index >= this.fillEndCount)
    );
  }

  render() {
    const date = this.getValidDate();

    return (
      <div class="calendar material">
        <header>
          <span onClick={this.switchToPreviousMonth}>{'<'}</span>
          <span>
            {this.monthNames[date.month - 1]} {date.year}
          </span>
          <span onClick={this.switchToNextMonth}>{'>'}</span>
        </header>
        <div class="day-names">
          {this.daysNames.map((dayName) => (
            <span>{dayName}</span>
          ))}
        </div>
        <div class="days-in-month">
          {this.daysInMonth.map((day, index) => {
            const classNameDigit = this.getDigitClassNames(
              day,
              date.month,
              date.year,
              index
            );

            if (index < this.fillStartCount || index >= this.fillEndCount) {
              return (
                <span class="disabled">{this.showFillDays ? day : ''}</span>
              );
            } else {
              return (
                <span onClick={() => this.daySelectedHandler(day)}>
                  <i class={classNameDigit}>{day}</i>
                </span>
              );
            }
          })}
        </div>
      </div>
    );
  }
}
