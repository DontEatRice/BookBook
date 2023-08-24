namespace Server.Domain.Entities
{
    public class OpenHours
    {
        public Guid Id { get; set; }
        public TimeOnly? MondayOpenTime { get; set; }
        public TimeOnly? MondayCloseTime { get; set; }
        public TimeOnly? TuesdayOpenTime { get; set; }
        public TimeOnly? TuesdayCloseTime { get; set; }
        public TimeOnly? WednesdayOpenTime { get; set; }
        public TimeOnly? WednesdayCloseTime { get; set; }
        public TimeOnly? ThursdayOpenTime { get; set; }
        public TimeOnly? ThursdayCloseTime { get; set; }
        public TimeOnly? FridayOpenTime { get; set; }
        public TimeOnly? FridayCloseTime { get; set; }
        public TimeOnly? SaturdayOpenTime { get; set; }
        public TimeOnly? SaturdayCloseTime { get; set; }
        public TimeOnly? SundayOpenTime { get; set; }
        public TimeOnly? SundayCloseTime { get; set; }

        public static OpenHours Create(Guid id,
            TimeOnly? mondayOpenTime,
            TimeOnly? mondayCloseTime,
            TimeOnly? tuesdayOpenTime,
            TimeOnly? tuesdayCloseTime,
            TimeOnly? wednesdayOpenTime,
            TimeOnly? wednesdayCloseTime,
            TimeOnly? thursdayOpenTime,
            TimeOnly? thursdayCloseTime,
            TimeOnly? fridayOpenTime,
            TimeOnly? fridayCloseTime,
            TimeOnly? saturdayOpenTime,
            TimeOnly? saturdayCloseTime,
            TimeOnly? sundayOpenTime,
            TimeOnly? sundayCloseTime
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
}
