import $ from 'jquery';
import {localhostURL} from './constant';

export function getBoards()
{
    var boards = null;
    $.ajax
    ({
        type: "GET",
        url: localhostURL+"/boards",
        async: false,
        //data: {varName : varValue},
        //dataType: "text",
        success: function(data)
        {
            //console.log(data);
            boards = data;
            //service.renderBoards(data);
        },
        error: function(ex)
        {
            console.error("Unable to get data");
        }
    });

    return boards;
};

export function getBoard(boardId)
{
    var board = null;
    $.ajax
    ({
        type: "GET",
        url: localhostURL+"/boards/"+boardId,
        async: false,
        //data: {varName : varValue},
        //dataType: "text",
        success: function(data)
        {
            //console.log(data);
            board = data;
        },
        error: function(ex)
        {
            console.error("Unable to get data");
        }
    });

    return board;
}

export function saveDataUsingURL(url, data, requestType)
{
    //console.log(url);

    $.ajax
    ({
        type: requestType,
        url: localhostURL+"/"+url,
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