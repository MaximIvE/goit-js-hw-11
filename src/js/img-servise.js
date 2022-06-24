export default class ImgApiService{
    constructor(){
        //Яку сторінку плануємо завантажувати
        this.page = 1;
        //Підключаємо бібліотеку для запитів
        this.axios = require('axios').default;
        //Тут тільки позитивні попередні запроси
        this.query = "";
        //Тут - це при такому запросі остання сторінка ("end"), чи малювати далі ("more")
        this.status = "more";
        //Якщо це новий позитивний запрос, то сторінку слід буде перемалювати в документі
        this.isnewquerty = true;
    }
    
    async fetchImages(searchQuery){
        let backupPage;
        if((searchQuery !== this.query)){ 
            backupPage = this.page;
            this.page = 1;
        };

        const KEY = '28160645-02600786ca706ffa5b60b520e';
        const url = 'https://pixabay.com/api/?';
        const per_page = 40;
        const options = {
            params: {
            'key': KEY,
            'image_type': 'photo',
            'orientation': 'horizontal',
            'safesearch': 'true',
            'q': searchQuery,
            'page': this.page,
            'per_page': per_page,
            },
        };
        try {
        const response = await this.axios.get(url, options);
        

        //Якщо запрос нічого не знайшов, повертаємо page попереднє значення
        //Зберігаємо позитивний запрос в "query" і кажемо, щ це новий позитивний запрос
        const totalHits = response.data.totalHits;
                if (totalHits === 0){
            this.page = backupPage;
        }else{
            this.isnewquerty = (searchQuery === this.query) ? false : true;
            this.query = searchQuery;
            const numberOfLetters = Math.ceil(totalHits / per_page);
           
            if(numberOfLetters === this.page){
                this.status = "end";
            }else{
                this.page += 1;
                this.status = "more";
            }
        }
 

        return response.data;
        } catch (error) {
            this.page = backupPage;
            console.log(error.message);
        }
    }
};