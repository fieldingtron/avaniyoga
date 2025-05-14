/* eslint-disable no-undef */
$(function () {
  $("#contactus input,#contactus select,#contactus textarea")
    .not("[type=submit]")
    .jqBootstrapValidation({
      preventSubmit: true,
      submitError: function ($form, event, errors) {
        console.log("error");
        // additional error messages or events
      },
      submitSuccess: async function ($form, event) {
        console.log("submitting!!");
        event.preventDefault(); // prevent default submit behaviour

        // Get values from the form
        var name = $("input#contact-name").val();
        var email = $("input#contact-email").val();
        var subject = $("input#contact-subject").val();
        var message = $("textarea#contact-message").val();
        var firstName = name.split(" ")[0]; // For Success/Failure Message

        // Display loading state on submit button
        var $this = $("#sendMessageButton");
        $this.prop("disabled", true);

        // Prepare data for the API
        const data = {
          name,
          email,
          subject,
          message,
        };

        console.log("Sending contact form data:", data);

        // Send data to our API route
        try {
          let response = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(data),
          });

          const responseData = await response.json();
          console.log("API response:", responseData);

          if (response.ok) {
            console.log("Email sent successfully");
            $("#success")
              .html("<div class='alert alert-success'>")
              .find(".alert-success")
              .html(
                "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"
              )
              .append("<strong>Your message has been sent. </strong>")
              .append("</div>");
            $("#contactForm").trigger("reset"); // Clear all fields
          } else {
            console.error("API error:", responseData);
            let errorMessage =
              responseData.error ||
              "Oops! There was a problem submitting your form.";
            $("#success")
              .html("<div class='alert alert-danger'>")
              .find(".alert-danger")
              .html(
                "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"
              )
              .append($("<strong>").text(errorMessage))
              .append("</div>");
          }
        } catch (error) {
          console.error("Contact form error:", error);
          $("#success")
            .html("<div class='alert alert-danger'>")
            .find(".alert-danger")
            .html(
              "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>"
            )
            .append(
              $("<strong>").text(
                "Sorry " +
                  firstName +
                  ", it seems that my mail server is not responding. Please try again later!"
              )
            )
            .append("</div>");
        } finally {
          $this.prop("disabled", false); // Re-enable submit button
        }
      },
      filter: function () {
        return $(this).is(":visible");
      },
    });

  $('a[data-toggle="tab"]').click(function (e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

/* Clear success/fail messages on focus */
$("#name").focus(function () {
  $("#success").html("");
});
