const url = '/constants/';

function init() {
    bindAdd();
    bindEdit();
    bindRemove();
}

function bindAdd() {
    $('#add-constant').on('click', function () {
        let type = $('#constant-type').val();
        let data = {
            type: type,
            value: $('#constant-value').val()
        };
        $.ajax({
            type: 'POST',
            url: url + type,
            data: data,
        }).done(function (response) {
            let parsed = JSON.parse(response);
            redirectByResponse(parsed, url + type);
        });
    });
}

function bindEdit() {
    $('#update-constant').on('click', function() {
        let type = $('#constant-type').val();
        let data = {
            type: type,
            value: $('#constant-value').val()
        };
        $.ajax({
            type: 'PUT',
            url: window.location.pathname,
            data: data,
        }).done(function (response) {
            let parsed = JSON.parse(response);
            redirectByResponse(parsed, url + type + '/' + parsed.data);
        });
    });
}

function bindRemove() {
    $('#delete-constant').on('click', function() {
        if (confirm('Are you sure you want to delete this item?') === true) {
            let type = $('#constant-type').val();
            $.ajax({
                type: 'DELETE',
                url: window.location.pathname,
            }).done(function (response) {
                redirectByResponse(JSON.parse(response), url + type);
            });
        }
    });
}

function getUrl() {

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