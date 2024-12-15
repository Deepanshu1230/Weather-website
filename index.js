const userTab=document.querySelector("[data-userWeather]");
const SearchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccess=document.querySelector(".grant-location-container");
const searchForm=document.querySelector(".form-container");
const SearchCity=document.querySelector("[data-searchInput]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const notFound=document.querySelector("[not-found]");



//intially variable declare
let oldTab=userTab;
const API_KEY="5241a11d9e3d4ceb5c113a2813c6d801";
oldTab.classList.add("current-tab");

///ek kam or pending he ???
getfromSessionStorage();

function switchTab(newTab){
    if(newTab !== oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //kya search form wala conatainer is invisible,so make it visible
            grantAccess.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
            notFound.classList.remove("active");
        }
        else{
            //your weather wale par jana he to hame search wle or uske constent ko haa paedega
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            notFound.classList.remove("active");
            //ab me your weather wale tab me aa gya hu to tab to open karna padega
            //agar coordinates he to local stroage me store ka lo 
            getfromSessionStorage();
        }
    }

}


userTab.addEventListener("click",() =>{
    switchTab(userTab);

}
    
);

SearchTab.addEventListener("click",()=>{
    switchTab(SearchTab);
});

function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nahi mile to
        grantAccess.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
};

async function fetchUserWeatherInfo(coordinates){
    let {lat,lon}=coordinates;
    //make the  grant loacation invisible
    grantAccess.classList.remove("active");
    //make the loader visible 
    loadingScreen.classList.add("active");

    //API call marni he bus ab
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        let data=await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        //hamne isko bas active kara he to  hame iame value bhi dalni hogi to
        // hum render function use karenge
        RenderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
        ///HW
        alert("Error in frtching the current location");

    }
};

function RenderWeatherInfo(WeatherInfo){

    ///Firstly we have to fetch the value
    const cityName=document.querySelector("[data-cityname]");
    const cityIcon=document.querySelector("[data-countryflag]");
    const desc=document.querySelector("[data-weatherdesc]");
    const weatherIcon=document.querySelector("[data-weathericon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloud=document.querySelector("[data-clouds]");
     

    cityName.innerText=WeatherInfo?.name;
    desc.innerText=WeatherInfo?.weather?.[0]?.description;
    temp.innerText = `${WeatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${WeatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${WeatherInfo?.main?.humidity}%`;
    cloud.innerText = `${WeatherInfo?.clouds?.all}%`;
    cityIcon.src = `https://flagcdn.com/144x108/${WeatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${WeatherInfo?.weather?.[0]?.icon}.png`;
    
}

const grantAccessBtn=document.querySelector("[data-grantAccess]");


function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    else{
        //hw-- show an alert for the geoloacation not available
    }

}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    // grantAccess.classList.remove("active"); 
    fetchUserWeatherInfo(userCoordinates);


}





grantAccessBtn.addEventListener("click",getlocation);




//Now creating for the searh weather form

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    const cityName=searchInput.value;

    if(cityName === "" ){
        alert("Please entert the city name")
        return;
        
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    grantAccess.classList.remove("active");
    userInfoContainer.classList.remove("active");
    notFound.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data=await response.json();


        if(data.cod === "404"){
            userInfoContainer.classList.remove("active");
            notFound.classList.add("active");
            loadingScreen.classList.remove("active");
            return;
        }

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        notFound.classList.remove("active");
        RenderWeatherInfo(data);


    }

    catch(e){
        //hw
        notFound.classList.add("active");
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        

    }
}