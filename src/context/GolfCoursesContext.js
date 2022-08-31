import { createContext, useState, useContext } from 'react'
import axios from 'axios'


const golfCoursesContext = createContext()

export function GolfCoursesContextProvider({ children }) {
    const [golfCourses, setGolfCourses] = useState([])
    const [golfCourseDetails, setGolfCourseDetails] = useState({})

    const getGolfCourses = async (radius, lat, lng) => {
        const URL = 'https://golf-course-finder.p.rapidapi.com/courses'
        try {
            const { data } = await axios.get(URL, {
                params: { radius: radius, lat: lat, lng: lng },
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

    const getGolfCourseDetails = async (zipcode, name) => {
        const URL = 'https://golf-course-finder.p.rapidapi.com/course/details'
        try {
            const { data } = await axios.get(URL, {
                params: { zip: zipcode, name: name },
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

    return (
        <golfCoursesContext.Provider value={{
            golfCourses, setGolfCourses, getGolfCourses,
            golfCourseDetails, setGolfCourseDetails, getGolfCourseDetails
        }}>
            {children}
        </golfCoursesContext.Provider>
    )
}

export function useGolfCoursesContext() {
    return useContext(golfCoursesContext)
}