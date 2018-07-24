module.exports = 
{
    hideBoards: function()
    {
        document.getElementById('boardContainer').style.display = 'none';
    },

    hideCardList: function()
    {
        document.getElementById('workplace').style.display = 'none';
    },

    showBoards: function()
    {
        document.getElementById('boardContainer').style.display = 'block';
    },

    showCardList: function()
    {
        document.getElementById('workplace').style.display = 'block';
    }
}