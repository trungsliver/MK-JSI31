document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
        document.getElementById(
            "contactForm"
        );

        form.addEventListener(
            "submit",
            function(e){

                e.preventDefault();

                const name =
                document.getElementById(
                    "fullName"
                ).value;

                alert(
                    `Cảm ơn ${name}! Chúng tôi đã nhận được liên hệ của bạn và sẽ phản hồi sớm nhất.`
                );

                form.reset();

            }
        );

    }
);