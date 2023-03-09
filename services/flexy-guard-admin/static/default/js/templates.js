function init() {
    bindRemove();
}

function bindRemove() {
    $('.js-item-delete').on('click', function () {
        let _this = $(this);

        if (confirm('Are you sure you want to delete this item?') === true) {
            $.ajax({
                type: 'DELETE',
                url: '/templates/' + _this.data('id'),
            }).done(function() {
                _this.parents('tr').remove();
            });
        }
    });
}

$(document).ready(init);