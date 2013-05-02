$(document).ready(function(){
    $("#newSnippet").click(function(){
        var snippetId = uuid.v4();
        window.location = "/snippet#" + snippetId;        
    });
});
