export const calculateSubjectTotalHours = (
  startTime: string,
  endTime: string,
  durationWeeks: string,
  weekdays: string
): number => {
  // Split startTime and endTime into hours and minutes
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  // Create Date objects for startTime and endTime
  const start = new Date(2000, 0, 1, startHour, startMinute);
  const end = new Date(2000, 0, 1, endHour, endMinute);

  // Calculate the difference in milliseconds
  const diffMs = end.getTime() - start.getTime();

  // Convert milliseconds to hours
  const diffHours = diffMs / (1000 * 60 * 60);

  // Calculate total hours based on durationWeeks and weekdays
  const totalHours = diffHours * parseInt(durationWeeks) * weekdays.split(',').length;

  return totalHours;
}