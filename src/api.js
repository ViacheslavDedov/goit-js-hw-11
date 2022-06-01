import axios from "axios";

export default class ApiService {
    constructor() {
      this.searchQuery = '';
      this.page = 1;
      this.per_page = 40;
    }
 async fetchImages() {
    const API_KEY = `27787578-75c7552d3109bab8bb14f44ba`;
    const options =  new URLSearchParams({
        key: API_KEY,
        image_type: "photo",
        q: this.searchQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: this.per_page,
        page:  this.page,
        
})
    try {
      const {data} =await axios.get(`https://pixabay.com/api/?${options}`);
      this.page += 1;
      return data; }
      catch{Notify.failure(error.message);}        
  };
  
    resetPage() {
       this.page = 1; 
    }
    get query() {
      return  this.searchQuery;
    };
    set query(newQuery) {
        this.searchQuery = newQuery;
  };
   getCurrentPage() {
    return this.page;
  };
  getPer_page() {
    return this.per_page;
  }
}