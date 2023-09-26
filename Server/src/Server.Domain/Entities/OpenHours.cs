namespace Server.Domain.Entities;

public class OpenHours
{
    public Guid Id { get; set; }
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

    public static OpenHours Create(Guid id,
        TimeSpan? mondayOpenTime,
        TimeSpan? mondayCloseTime,
        TimeSpan? tuesdayOpenTime,
        TimeSpan? tuesdayCloseTime,
        TimeSpan? wednesdayOpenTime,
        TimeSpan? wednesdayCloseTime,
        TimeSpan? thursdayOpenTime,
        TimeSpan? thursdayCloseTime,
        TimeSpan? fridayOpenTime,
        TimeSpan? fridayCloseTime,
        TimeSpan? saturdayOpenTime,
        TimeSpan? saturdayCloseTime,
        TimeSpan? sundayOpenTime,
        TimeSpan? sundayCloseTime
        )
    => new()
    {
        Id = id,
        MondayOpenTime = mondayOpenTime,
        MondayCloseTime = mondayCloseTime,
        TuesdayOpenTime = tuesdayOpenTime,
        TuesdayCloseTime = tuesdayCloseTime,
        WednesdayOpenTime = wednesdayOpenTime,
        WednesdayCloseTime = wednesdayCloseTime,
        ThursdayOpenTime = thursdayOpenTime,
        ThursdayCloseTime = thursdayCloseTime,
        FridayOpenTime = fridayOpenTime,
        FridayCloseTime = fridayCloseTime,
        SaturdayOpenTime = saturdayOpenTime,
        SaturdayCloseTime = saturdayCloseTime,
        SundayOpenTime = sundayOpenTime,
        SundayCloseTime = sundayCloseTime
    };
}
