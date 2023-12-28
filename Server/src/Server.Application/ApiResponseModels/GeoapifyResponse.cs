namespace Server.Application.ApiResponseModels;

public class GeoapifyResponse
{
    public List<GeoapifyResult> Results { get; set; }

}

public class GeoapifyResult
{
    public double Lon { get; set; }
    public double Lat { get; set; }
}
