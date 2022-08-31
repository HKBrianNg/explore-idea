import axios from 'axios'


export const getPlacesData = async (sw, ne) => {
    const URL = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary'

    try {
        const { data: { data } } = await axios.get(URL, {
            params: {
                bl_latitude: sw.lat,
                tr_latitude: ne.lat,
                bl_longitude: sw.lng,
                tr_longitude: ne.lat
            },
            headers: {
                'X-RapidAPI-Key': 'd222430dc4msh3216a8da5df0133p10cb60jsna80cb3930ee5',
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
            }
        })
        return data
    } catch (error) {
        console.log(error)
    }
}

export const getGolfCourses = async () => {
    URL = 'https://golf-course-finder.p.rapidapi.com/courses'
    try {
        const { data } = await axios.get(URL, {
            params: { radius: '10', lat: '36.56910381018662', lng: '-121.95035631683683' },
            headers: {
                'X-RapidAPI-Key': 'd222430dc4msh3216a8da5df0133p10cb60jsna80cb3930ee5',
                'X-RapidAPI-Host': 'golf-course-finder.p.rapidapi.com'
            }
        })
        return data
    } catch (error) {
        console.log(error)
    }

}