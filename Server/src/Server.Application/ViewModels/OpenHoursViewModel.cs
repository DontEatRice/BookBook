namespace Server.Application.ViewModels;

public class OpenHoursViewModel
{
    public TimeSpan? MondayOpenTime { get; set; }
    public TimeSpan? MondayCloseTime { get; set; }
    public TimeSpan? TuesdayOpenTime { get; set; }
    public TimeSpan? TuesdayCloseTime { get; set; }
    public TimeSpan? WednesdayOpenTime { get; set; }
    public TimeSpan? WednesdayCloseTime { get; set; }
    public TimeSpan? ThursdayOpenTime { get; set; }
    public TimeSpan? ThursdayCloseTime { get; set; }
    public TimeSpan? FridayOpenTime { get; set; }
    public TimeSpan? FridayCloseTime { get; set; }
    public TimeSpan? SaturdayOpenTime { get; set; }
    public TimeSpan? SaturdayCloseTime { get; set; }
    public TimeSpan? SundayOpenTime { get; set; }
    public TimeSpan? SundayCloseTime { get; set; }
}
