/* eslint-disable no-undef */
$(function () {
  $('#contactus input,#contactus select,#contactus textarea')
    .not('[type=submit]')
    .jqBootstrapValidation({
      preventSubmit: true,
      submitError: function ($form, event, errors) {
        console.log('error')
        // additional error messages or events
      },
      submitSuccess: async function ($form, event) {
        console.log('submitting!!')
        event.preventDefault() // prevent default submit behaviour

        // Get values from the form
        var name = $('input#contact-name').val()
        var email = $('input#contact-email').val()
        var subject = $('input#contact-subject').val()
        var message = $('textarea#contact-message').val()
        var firstName = name.split(' ')[0] // For Success/Failure Message

        // Display loading state on submit button
        var $this = $('#sendMessageButton')
        $this.prop('disabled', true)

        // Create FormData object for Formspree
        var data = new FormData()
        data.append('name', name)
        data.append('email', email)
        data.append('subject', subject)
        data.append('message', message)

        // Send data to Formspree
        try {
          let response = await fetch('https://formspree.io/f/mpwzddvg', {
            method: 'POST',
            body: data,
            headers: { Accept: 'application/json' },
          })

          if (response.ok) {
            $('#success')
              .html("<div class='alert alert-success'>")
              .find('.alert-success')
              .html(
                "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"
              )
              .append('<strong>Your message has been sent. </strong>')
              .append('</div>')
            $('#contactForm').trigger('reset') // Clear all fields
          } else {
            let errorData = await response.json()
            let errorMessage = 'Oops! There was a problem submitting your form.'
            if (errorData.errors) {
              errorMessage = errorData.errors
                .map((error) => error.message)
                .join(', ')
            }
            $('#success')
              .html("<div class='alert alert-danger'>")
              .find('.alert-danger')
              .html(
                "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"
              )
              .append($('<strong>').text(errorMessage))
              .append('</div>')
          }
        } catch (error) {
          console.log('error', error)
          $('#success')
            .html("<div class='alert alert-danger'>")
            .find('.alert-danger')
            .html(
              "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"
            )
            .append(
              $('<strong>').text(
                'Sorry ' +
                  firstName +
                  ', it seems that my mail server is not responding. Please try again later!'
              )
            )
            .append('</div>')
        } finally {
          $this.prop('disabled', false) // Re-enable submit button
        }
      },
      filter: function () {
        return $(this).is(':visible')
      },
    })

  $('a[data-toggle="tab"]').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
})

/* Clear success/fail messages on focus */
$('#name').focus(function () {
  $('#success').html('')
})
