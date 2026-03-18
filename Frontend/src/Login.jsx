import {useState} from "react"
const Login = () => {
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="flex justify-center my-10">
            <div className="card bg-base-300 w-96 shadow-sm">
                <div className="card-body">
                    <h2 className="card-title text-3xl font-semibold justify-center">Login</h2>
                    <div>
                        <fieldset className="fieldset my-3">
                            <legend className="fieldset-legend my-1 font-normal text-base">Email ID</legend>
                            <input type="email" value={emailId} className="input input-bordered w-full px-3" 
                            onChange={(e)=> setEmailId(e.target.value)}
                            />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend my-1 font-normal text-base">Password</legend>
                            <input type="password" value={password} className="input input-bordered w-full px-3"  
                            onChange={(e)=> setPassword(e.target.value)}
                            />
                        </fieldset>
                    </div>
                    <div className="card-actions justify-center py-3">
                        <button className="px-4 py-2 rounded-lg bg-blue-500 text-white shadow-md shadow-blue-500/40 hover:bg-blue-600 transition">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;