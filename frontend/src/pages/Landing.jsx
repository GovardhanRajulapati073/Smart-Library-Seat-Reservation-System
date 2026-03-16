import { useEffect, useState } from "react";

function Landing() {

const heroImages = [
"https://res.cloudinary.com/di9hkkbfb/image/upload/v1773341450/tt_mmr9lv.jpg",
"https://res.cloudinary.com/di9hkkbfb/image/upload/v1773286309/1_o6kl8a.png",
"https://res.cloudinary.com/di9hkkbfb/image/upload/v1773341449/11_vtkpro.jpg",
"https://res.cloudinary.com/di9hkkbfb/image/upload/v1773341450/22_mcuhls.jpg"
];

const featured = [
{
title:"Digital Programming Guide",
img:"https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800"
},
{
title:"Artificial Intelligence",
img:"https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800"
},
{
title:"Modern Web Development",
img:"https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800"
},
{
title:"Data Science Handbook",
img:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800"
},
{
title:"Machine Learning Basics",
img:"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800"
}
];

const [current,setCurrent] = useState(0);

const [books,setBooks] = useState(0);
const [ebooks,setEbooks] = useState(0);
const [computers,setComputers] = useState(0);
const [seats,setSeats] = useState(0);


useEffect(()=>{
const interval = setInterval(()=>{
setCurrent((prev)=>(prev+1)%heroImages.length)
},3500)

return ()=>clearInterval(interval)

},[])


useEffect(()=>{

let b=0,e=0,c=0,s=0;

const counter=setInterval(()=>{

if(b<12000){b+=200;setBooks(b)}
if(e<5000){e+=100;setEbooks(e)}
if(c<150){c+=5;setComputers(c)}
if(s<300){s+=5;setSeats(s)}

},40)

return ()=>clearInterval(counter)

},[])



return (

<div className="relative min-h-screen bg-gray-950 text-white overflow-x-hidden">


{/* GRID BACKGROUND */}

<div className="absolute inset-0 -z-20
bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),
linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
bg-[size:40px_40px]">
</div>



{/* NAVBAR */}

<nav className="flex justify-between items-center px-12 py-6 border-b border-gray-800">

<h1 className="text-3xl font-bold text-blue-400">
Smart Library
</h1>

<div className="space-x-4">

<a href="/login"
className="px-5 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition">
Login
</a>

<a href="/register"
className="px-5 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
Register
</a>

</div>

</nav>



{/* HERO SECTION */}

<section className="relative flex flex-col items-center text-center mt-20 px-6">


{/* glow background */}

<div className="absolute -z-10 w-[700px] h-[700px]
bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-purple-500/20
blur-[140px] rounded-full animate-pulse">
</div>



{/* floating particles */}

<div className="absolute inset-0 -z-10 pointer-events-none">

<div className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-70 animate-ping top-[10%] left-[20%]"></div>
<div className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-70 animate-ping top-[40%] right-[25%]"></div>
<div className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-70 animate-ping bottom-[20%] left-[35%]"></div>

</div>



<h2
className="text-6xl font-bold mb-6 tracking-tight
bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500
text-transparent bg-clip-text drop-shadow-lg"
style={{fontFamily:"Space Grotesk"}}
>
Smart Library Seat Reservation
</h2>


<p className="text-gray-400 max-w-2xl mb-12 text-lg">
A modern platform that simplifies library seat reservations
and improves study space management with real-time seat availability.
</p>



{/* HERO IMAGE SLIDER */}

<div className="relative w-[900px] h-[420px] overflow-hidden rounded-xl border border-gray-800 shadow-xl">

{heroImages.map((img,index)=>(

<img
key={index}
src={img}
alt="library"
className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
index===current ? "opacity-100" : "opacity-0"
}`}
/>

))}

</div>

</section>



{/* FEATURED RESOURCES CAROUSEL */}

<section className="mt-28 px-10">

<h3 className="text-3xl font-bold text-center mb-12">
Featured Resources
</h3>

<div className="overflow-hidden">

<div className="flex gap-8 animate-[scroll_25s_linear_infinite]">

{featured.concat(featured).map((item,index)=>(

<div key={index}
className="group relative min-w-[260px]
bg-white/5 backdrop-blur-md p-4 rounded-xl border border-gray-700 overflow-hidden">


{/* light sweep */}

<div className="absolute inset-0
bg-gradient-to-r from-transparent via-white/20 to-transparent
translate-x-[-100%] group-hover:translate-x-[100%]
transition duration-1000"></div>


<img
src={item.img}
alt={item.title}
className="w-full h-40 object-cover rounded-lg"
/>

<h4 className="mt-4 text-lg font-semibold text-blue-400 relative z-10">
{item.title}
</h4>

</div>

))}

</div>

</div>

</section>



{/* STATISTICS */}

<section className="mt-28 px-10">

<h3 className="text-3xl font-bold text-center mb-12">
Library Resources
</h3>

<div className="grid md:grid-cols-4 gap-8 text-center">

<div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-gray-700">
<h4 className="text-4xl font-bold text-blue-400">{books}+</h4>
<p className="text-gray-400 mt-2">Books</p>
</div>

<div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-gray-700">
<h4 className="text-4xl font-bold text-blue-400">{ebooks}+</h4>
<p className="text-gray-400 mt-2">E-Books</p>
</div>

<div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-gray-700">
<h4 className="text-4xl font-bold text-blue-400">{computers}+</h4>
<p className="text-gray-400 mt-2">Computers</p>
</div>

<div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-gray-700">
<h4 className="text-4xl font-bold text-blue-400">{seats}+</h4>
<p className="text-gray-400 mt-2">Study Seats</p>
</div>

</div>

</section>



{/* FEATURES */}

<section className="mt-28 px-10">

<h3 className="text-3xl font-bold text-center mb-12">
Key Features
</h3>

<div className="grid md:grid-cols-2 gap-10">

<div className="group relative overflow-hidden
bg-white/5 backdrop-blur-md p-8 rounded-xl border border-gray-700
transition transform hover:scale-105">

<div className="absolute inset-0
bg-gradient-to-r from-transparent via-white/20 to-transparent
translate-x-[-100%] group-hover:translate-x-[100%]
transition duration-1000"></div>

<h4 className="text-xl font-semibold mb-3 relative z-10">
Real-Time Seat Booking
</h4>

<p className="text-gray-400 relative z-10">
Instantly check seat availability and reserve seats easily.
</p>

</div>



<div className="group relative overflow-hidden
bg-white/5 backdrop-blur-md p-8 rounded-xl border border-gray-700
transition transform hover:scale-105">

<div className="absolute inset-0
bg-gradient-to-r from-transparent via-white/20 to-transparent
translate-x-[-100%] group-hover:translate-x-[100%]
transition duration-1000"></div>

<h4 className="text-xl font-semibold mb-3 relative z-10">
Time Slot Management
</h4>

<p className="text-gray-400 relative z-10">
Reserve seats based on flexible time slots.
</p>

</div>



<div className="group relative overflow-hidden
bg-white/5 backdrop-blur-md p-8 rounded-xl border border-gray-700
transition transform hover:scale-105">

<div className="absolute inset-0
bg-gradient-to-r from-transparent via-white/20 to-transparent
translate-x-[-100%] group-hover:translate-x-[100%]
transition duration-1000"></div>

<h4 className="text-xl font-semibold mb-3 relative z-10">
Booking History
</h4>

<p className="text-gray-400 relative z-10">
View and manage your past reservations easily.
</p>

</div>



<div className="group relative overflow-hidden
bg-white/5 backdrop-blur-md p-8 rounded-xl border border-gray-700
transition transform hover:scale-105">

<div className="absolute inset-0
bg-gradient-to-r from-transparent via-white/20 to-transparent
translate-x-[-100%] group-hover:translate-x-[100%]
transition duration-1000"></div>

<h4 className="text-xl font-semibold mb-3 relative z-10">
Admin Monitoring
</h4>

<p className="text-gray-400 relative z-10">
Admins can monitor occupancy and library usage.
</p>

</div>

</div>

</section>



<footer className="mt-32 py-8 border-t border-gray-800 text-center text-gray-500">
© 2026 Smart Library System
</footer>


</div>

)

}

export default Landing