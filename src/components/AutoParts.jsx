import React from "react";
import Footer from "./Footer";
import Font from "react-font";

function AutoParts() {
  const stats = [
    { id: 1, name: '', value: 'AutoZone', link: "https://www.autozone.com/", imageSrc: 'https://www.autozone.com/images/az-logo-full.svg' },
    { id: 3, name: '', value: 'Rock Auto', link: "https://www.rockauto.com/", imageSrc: 'https://www.rockauto.com/Images/mobile/headertextlogo-short.png' },
  ];

  const performanceAutoParts = [
    { id: 1, name: '', value: 'Magna Flow', link: "https://www.magnaflow.com/", imageSrc: 'https://www.magnaflow.com/cdn/shop/t/145/assets/logo-header.svg?v=154536293364626413751689267314' },
    { id: 2, name: '', value: 'Summit Racing', link: "https://www.summitracing.com/", imageSrc: ' https://static.summitracing.com/global/images/mygarage/my-garage-logo.svg ' },
    { id: 3, name: '', value: 'Vivid Racing', link: "https://www.vividracing.com/", imageSrc: 'https://www.vividracing.com/templates/vr23/images/vr-logo-large.webp' },
  ];

  const howTo = [
    { id: 1, name: '', value: 'WikiHow', link: "https://www.wikihow.com/Main-Page", imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/WikiHow_logo_-_primary_2014.png' },
    { id: 2, name: '', value: 'Start my Car', link: "https://www.startmycar.com/us", imageSrc: 'https://static.startmycar.com/images/home/infographic-solve.png?v=33a747' },
    { id: 3, name: '', value: 'Vivid Racing', link: "https://www.carcarekiosk.com/", imageSrc: 'https://storage.googleapis.com/rp-production-public-content/buxe0ku8ae1nnhdhmogmeakhxfa3' },
  ];

  return (
    <>
  
      <div className="bg-black min-h-screen text-white pt-10">
    

        <div className="py-12 sm:py-20 lg:py-24 bg-gray-900 ">
    <Font family="Josefin Slab">    <h1 className="text-center text-3xl sm:text-4xl lg:text-4xl font-thin  relative bottom-5md:relative md:bottom-10">Vehicle Owner Guides</h1></Font>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
              {howTo.map((howTos) => (
                <a href={howTos.link} key={howTos.name} target="_blank" className="block group no-underline">
                  <img
                    src={howTos.imageSrc}
                    alt={howTos.name}
                    className="w-40 sm:w-48 lg:w-60 mx-auto transition-transform duration-200 group-hover:scale-105"
                  />
                  <h3 className="text-blue-500 mt-4 text-base sm:text-lg lg:text-xl">{howTos.name}</h3>
                </a>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AutoParts;
