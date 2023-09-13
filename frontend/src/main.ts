import "./style.css";
import axios from "axios";
import { z } from "zod";

const NasaResponseSchema = z.object({
  date: z.string(),
  explanation: z.string(),
  title: z.string(),
  url: z.string()
})

type Nasa = z.infer<typeof NasaResponseSchema>

const BASE_URL = "https://api.nasa.gov/planetary/apod?"

//-----------------app state------------------------

let selectedDate = new Date().toISOString().split('T')[0]

//-----------------mutation-------------------------

const getData = async (selectedDate: string): Promise<Nasa | null>  => {
  const response = await axios.get (BASE_URL ,  {
    params: {
      date:selectedDate,
      api_key : "b7Bgb9vwgz5NsPA0bqPYQbdxIN7N8pokFCWVEsVo"
    }
  })

  const result = NasaResponseSchema.safeParse(response.data)

  if (!result.success) {
    return null
  }else {
    return result.data
  }

}
//--------------------------render---------------------------
const renderDetails = (details: Nasa)=> {
  const content = `
  <img id="image" src= ${details.url}>
  <h1>Astronomy Picture of the Day</h1>
  <input id ="date-picker" type="date" value= "${selectedDate}">
  <p id="title">${details.title}</p>
  <p id="explanation">${details.explanation}</p>
  `
  document.getElementById("details")!.innerHTML = content
  document.getElementById("date-picker")?.addEventListener("change", changeListener)
}

//----------------------eventlistener-----------------------------------------
const changeListener = async (event:Event) => {
  const selectedDate = ((event.target as HTMLInputElement).value)

  const selectedDetails = await getData(selectedDate)
  if(selectedDetails)
  renderDetails(selectedDetails)
}

const init = async () => {
  const pictureOfTheDay = await getData("");
  if (pictureOfTheDay)
   renderDetails(pictureOfTheDay)
  
};

init ()
