import LEDMatrix from "../LedMatrix/index";
import GlassyChatbox from "../ui/GlassyChatBox";
// import LoginPage from "../Auth/Login";
// import SignupPage from "../Auth/Signup";

function Landing() {
    return (
        <div
            className="flex flex-col items-center justify-center h-screen w-screen absolute top-0 left-0">
            <LEDMatrix />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.9)_5%,rgba(0,0,0,0.85)_15%,rgba(0,0,0,0.8)_20%,rgba(0,0,0,0)_75%)] -z-9" />
            <p className="font-pixelify font-bold text-5xl text-cyan-50 mb-4">
                What do you want to Manimate?
            </p>
            <p className=" font-pixelify font-semibold text-xl text-neutral-300/90 mb-5">
                Turn complex concepts into easy-to-grasp visuals
            </p>
            <GlassyChatbox />
        </div>
    );
}

export default Landing;