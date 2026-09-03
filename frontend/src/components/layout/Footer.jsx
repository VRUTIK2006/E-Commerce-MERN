export default function Footer(){
    return(<>
    <div className="bg-gray-800 p-4 text-gray-400 flex flex-col justify-center items-center ">
        <div className="flex mb-4 gap-8">
            <div>
                <h1 className="font-semibold mb-4">Contact Details</h1>
                <p className="flex items-center gap-2 mb-4"><img src="/phone-call.png" alt="phone" className="h-6 invert-100" />+91 8799028144</p>
                <p className="flex items-center gap-2 mb-4"><img src="/email.png" alt="phone" className="h-6 invert-100" />parmarvrutikparmarvrutik@gmail.com</p>                
            </div>
            <div className="border"></div>
            <div>
               <h1 className="font-semibold mb-4">Connect With Us</h1>
               <a href="https://www.linkedin.com/in/vrutik-parmar-7a622a371/" target="_blank" className="flex gap-2 mb-4"><img src="/linkedin.png" alt="phone" className="h-6 invert-100" />Linkedin</a>
               <a href="https://github.com/VRUTIK2006" target="_blank" className="flex gap-2 mb-4"><img src="/github.png" alt="phone" className="h-6 invert-100" />GitHub</a>
            </div>
        </div>
        <div>
            &copy;copyright @2026 Buyon.in
        </div>
    </div>
    </>)
}