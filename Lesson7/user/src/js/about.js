document.addEventListener(
    "DOMContentLoaded",
    () => {

        const cards =
        document.querySelectorAll(
            ".value-card,.stat-card,.team-card"
        );

        const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if(entry.isIntersecting){

                        entry.target.classList.add(
                            "show"
                        );

                    }

                });

            },
            {
                threshold:0.2
            }
        );

        cards.forEach(card => {

            card.classList.add("fade-item");

            observer.observe(card);

        });

    }
);