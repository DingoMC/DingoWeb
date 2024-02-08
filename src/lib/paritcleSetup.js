const particleOptions = {
    background: { color: { value: "#000022", }, },
    fpsLimit: 120,
    particles: {
        color: { value: "#ffaa00", },
        links: {
            color: "#55ffff",
            distance: 150,
            enable: true,
            opacity: 0.7,
            width: 1,
        },
        move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce", },
            random: false,
            speed: 0.25,
            straight: false,
        },
        number: {
            density: { enable: false, },
            value: 60,
        },
        opacity: { value: 0.7, },
        shape: { type: "circle", },
        size: { value: { min: 2, max: 4 }, },
    },
    detectRetina: true,
}
export const particleOptionsMobile = {
    background: { color: { value: "#000022", }, },
    fpsLimit: 120,
    particles: {
        color: { value: "#dd9800", },
        links: {
            color: "#55ffff",
            distance: 100,
            enable: true,
            opacity: 0.5,
            width: 1,
        },
        move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce", },
            random: false,
            speed: 0.15,
            straight: false,
        },
        number: {
            density: { enable: false, },
            value: 25,
        },
        opacity: { value: 0.7, },
        shape: { type: "circle", },
        size: { value: { min: 1, max: 3 }, },
    },
    detectRetina: true,
}
export default particleOptions;