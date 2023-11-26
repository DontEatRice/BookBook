using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
