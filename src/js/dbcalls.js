import $ from 'jquery';
import {localhostURL} from './constant';

export function getData(url)
{
    var result = null;
    $.ajax
    ({
        type: "GET",
        url: url,
        async: false,
        //data: {varName : varValue},
        //dataType: "text",
        success: function(data)
        {
            //console.log(data);
            result = data;
            //service.renderBoards(data);
        },
        error: function(ex)
        {
            console.error("Unable to get data");
        }
    });

    return result;
};

// export function getBoard(boardId)
// {
//     var board = null;
//     $.ajax
//     ({
//         type: "GET",
//         url: localhostURL+"/boards/"+boardId,
//         async: false,
//         //data: {varName : varValue},
//         //dataType: "text",
//         success: function(data)
//         {
//             //console.log(data);
//             board = data;
//         },
//         error: function(ex)
//         {
//             console.error("Unable to get data");
//         }
//     });

//     return board;
// }

export function saveUpdateData(url, data, requestType)
{
    //console.log(url);

    $.ajax
    ({
        type: requestType,
        url: url,
        data: JSON.stringify(data),
        contentType : "application/json",
        //dataType: "text",
        success: function(data)
        {
            console.log(data);
            console.log("Saved to database");
        },
        error: function(ex)
        {
            console.error("Unable to get data");
        }
    });
}