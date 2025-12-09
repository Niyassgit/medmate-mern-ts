import React from "react";

const Testimonial = () => {
  const [tooltip, setTooltip] = React.useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  // FIX: Add proper typing
  const cardRefs = React.useRef<HTMLDivElement[]>([]);

  const testimonials = [
    {
      name: "John Doe",
      title: "Frontend Developer",
      message:
        "Integrating this component into our project was seamless and saved us countless hours of development and testing. Highly recommended!",
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    },
    {
      name: "Jane Smith",
      title: "Full Stack Engineer",
      message:
        "This solution not only simplified our workflow but also improved our UI consistency across the board. Excellent tool for modern teams.",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    },
    {
      name: "Bonnie Green",
      title: "UX Designer",
      message:
        "I was impressed with how intuitive and flexible the design was. It allowed us to rapidly prototype and launch features with confidence.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
    },
  ];

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const bounds = card.getBoundingClientRect();

    setTooltip({
      visible: true,
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
      text: testimonials[index].name,
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <>
      <h1 className="text-center text-4xl font-bold text-white">
        Testimonials
      </h1>
      <p className="text-center text-gray-400 mt-1">
        Real feedback from users who love our platform.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6 py-16">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            ref={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el!;
            }}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={handleMouseLeave}
            className="relative border border-gray-700 rounded-lg overflow-hidden max-w-sm hover:shadow-xl bg-black/20 backdrop-blur-md transition"
          >
            {tooltip.visible && tooltip.text === testimonial.name && (
              <span
                className="absolute px-2.5 py-1 text-xs rounded bg-indigo-500 text-white pointer-events-none"
                style={{
                  top: tooltip.y + 8,
                  left: tooltip.x + 8,
                }}
              >
                {tooltip.text}
              </span>
            )}

            <div className="flex flex-col items-center text-center p-8">
              <h3 className="text-lg font-semibold text-white">
                Very easy to integrate
              </h3>
              <p className="text-sm text-gray-300 my-4 line-clamp-3">
                {testimonial.message}
              </p>

              <div className="flex items-center mt-4">
                <img
                  className="rounded-full w-10 h-10"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div className="ml-3 text-left">
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-xs text-gray-400">{testimonial.title}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Testimonial;
