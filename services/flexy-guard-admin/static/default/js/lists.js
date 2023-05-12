function init() {
    const fileInputIp = $('#ip_countries');
    const fileInputLabelIp = $('#ip');
    const fileInputBin = $('#bin_countries');
    const fileInputLabelBin = $('#bin');
    let fileName = '';
      
    fileInputIp.on('change', function() {
        fileName = this.value.split('\\').pop();
        fileInputLabelIp.find('span').text(fileName);
    });

    fileInputBin.on('change', function() {
        fileName = this.value.split('\\').pop();
        fileInputLabelBin.find('span').text(fileName);
    });
    
    $('.js-open-modal').on('click', function () {
        if (this.id === 'btn1') {
            $("#bin").hide();
            $("#ip").show();
        } else {
            $("#bin").show();
            $("#ip").hide();
        }
        $('#block-list-modal').css('display', 'flex')
    })

    $('.js-close-modal').on('click', function () {
        $('#block-list-modal').css('display', 'none')
    })


    $('form').on('submit', function (e) {
        const formData = new FormData(this);
        formData.append('file_name', fileName);
        e.preventDefault();
        $.ajax({
          url: $(this).attr('action'),
          type: $(this).attr('method'),
          data: new FormData(this),
          processData: false,
          contentType: false,
          success: function (response) {
            $('#success-message').text(response.message).fadeIn();
            $('#block-list-modal').css('display', 'none');
            fileInputLabelIp.find('span').text('Choose file');
            fileInputLabelBin.find('span').text('Choose file');
            setTimeout(function () {
              $('#success-message').fadeOut();
            }, 4000); 
          },
          error: function (xhr, status, error) {
            $('#error-message').text(error).fadeIn();
          }
        });
      });
}

$(document).ready(init)
