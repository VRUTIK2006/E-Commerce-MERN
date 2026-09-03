export default function CategoryCard() {
  const categories = [
    {
      title: "Electronics & Gadgets",
      desc: "Mobile, Laptop, T.V, Music Player...",
      img: "Gadgets.avif",
      btnColor: "bg-purple-600",
    },
    {
      title: "Sports & Fitness",
      desc: "Sports items and Fitness Tools..",
      img: "Sportsfitness.avif",
      btnColor: "bg-amber-600",
    },
    {
      title: "Home & Kitchen",
      desc: "All Household Appliances..",
      img: "Homekitchen.jpg",
      btnColor: "bg-sky-600",
    },
    {
      title: "Fashion",
      desc: "All Trending Fashions..",
      img: "Fashion.png",
      btnColor: "bg-green-600",
    },
    {
      title: "Books",
      desc: "All Knowledge Books..",
      img: "Books.avif",
      btnColor: "bg-yellow-600",
    },
  ];

  return (
    <div className="flex gap-12">
      {categories.map((cat, i) => (
        <div
          key={i}
          className="bg-gray-700 w-64 rounded-2xl text-white p-2 flex flex-col 
                     hover:shadow-lg hover:shadow-white transition duration-300 hover:-translate-y-2"
        >
          <img
            src={cat.img}
            alt={cat.title}
            className="w-full h-40 object-cover mb-4 rounded-2xl"
          />
          <h1 className="font-bold mb-2">{cat.title}</h1>
          <p className="mb-2 text-gray-400">{cat.desc}</p>
          <button
            className={`px-4 py-2 rounded-2xl hover:scale-105 transition active:scale-95 ${cat.btnColor}`}
          >
            Explore
          </button>
        </div>
      ))}
    </div>
  );
}
