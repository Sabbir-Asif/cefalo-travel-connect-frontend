import LoginForm from "../../components/auth/LoginForm";

const Login: React.FC = () => {
    return (
        <div
            className="relative h-screen bg-[url('/src/assets/images/Nilgiri.webp')] bg-center bg-cover bg-no-repeat"
            style={{ backgroundPosition: 'center', backgroundSize: 'cover' }}
        >
            <div className="absolute inset-0 bg-transparent bg-opacity-20"></div>

            <div className="relative z-10 flex items-center justify-center h-full px-4 text-white space-y-8 max-w-6xl mx-auto gap-8 text-center">
                <LoginForm />
                <div className="text-5xl font-bold text-left leading-14">
                    THE GOAL OF LIFE IS <br />
                    <span className="">LIVING IN AGREEMENT</span> <br />
                    <span className="underline">WITH NATURE</span>
                </div>
            </div>
        </div>
    );
};

export default Login;