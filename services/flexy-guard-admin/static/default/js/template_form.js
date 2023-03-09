const url = '/templates';

function init() {
    let editor = initEditor();

    bindAdd(editor);
    bindEdit(editor);
    bindRemove();
}

function initEditor() {
    // create the editor
    let container = document.getElementById("jsoneditor");
    let options = {
        mode: 'tree',
        modes: ['code', 'form', 'text', 'tree', 'view']
    };
    let editor = new JSONEditor(container, options);

    let jsonContainer = $('#template_json');
    let json = '{}';
    if (jsonContainer !== undefined && jsonContainer !== '') {
        json = jsonContainer.val();
    }

    editor.set(JSON.parse(json));
    return editor;
}

function bindAdd(editor) {
    $('#add-template').on('click', function () {
        $.ajax({
            type: 'POST',
            url: url,
            data: prepareData(editor),
        }).done(function (response) {
            let parsed = JSON.parse(response);
            redirectByResponse(parsed, url + '/' + parsed.data);
        });
    });
}

function bindEdit(editor) {
    $('#update-template').on('click', function() {
        $.ajax({
            type: 'PUT',
            url: url + '/' + $('#hash').val(),
            data: prepareData(editor),
        }).done(function (response) {
            let parsed = JSON.parse(response);
            redirectByResponse(parsed, url + '/' + parsed.data);
        });
    });
}

function bindRemove() {
    $('#delete-template').on('click', function() {
        if (confirm('Are you sure you want to delete this item?') === true) {
            $.ajax({
                type: 'DELETE',
                url: url + '/' + $('#hash').val(),
            }).done(function (response) {
                redirectByResponse(JSON.parse(response), url);
            });
        }
    });
}

function prepareData(editor) {
    return {
        template: JSON.stringify(editor.get()),
        comment: $('#comment').val()
    };
}

function redirectByResponse(response, redirectUrl) {
    if (response.result === false) {
        alert(parsed.message);
    } else {
        window.location = redirectUrl;
    }
}

$(document).ready(init);