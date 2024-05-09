class TrainsData {
    constructor(source,destination,doj,quota='GN') {
        this.baseUrl = "https://securedapi.confirmtkt.com/api/platform";
        this.search_data = {
            source,destination,doj,quota

        }
        this.confirms = [];
    }
   async findStation(stationSearchQuery){
        const url = `${this.baseUrl}/getAutoSuggestedStationList?searchString=${stationSearchQuery}&language=EN&limit=1`;
        const data = await fetch(url)
        const stations = await data.json()
        try{
            const stationData = stations.StationList[0]
            const station = {
                stationName: stationData.stationName,
                stationCode: stationData.stationCode
            }
            return station
        }
        catch(err){
            console.log(err)
            return []
        }
        
    }
    async findTrains(){
        const source = this.search_data.source = await this.findStation(this.search_data.source)
        const destination = this.search_data.destination = await this.findStation(this.search_data.destination)
        if(!source || !destination){
            return 0
        }
        const url = `${this.baseUrl}/trainbooking/tatwnstns?fromStnCode=${source.stationCode}&destStnCode=${destination.stationCode}&doj=${this.search_data.doj}&token=&quota=${this.search_data.quota}&appVersion=290&androidid=mwebd_android`
        const data = await fetch(url)
        const trains_data = await data.json()
        if(!trains_data){
            return 1
        }
        const trains = trains_data.trainBtwnStnsList
        if(!trains){
            return []
        }
        return trains
    }
    async findConfirmTicktes(){
        const trains = await this.findTrains()
        const results = {
            search_data: this.search_data,
            trainsWithConfirmTickets:[]
        }
        if(trains == 0){
            return {error:true,message:'Something went wrong'}
        }
        if(trains == 1){
            return {error:true,message:'No trains found'}

        }
        if(!trains){
            return {error:true,message:'No trains between these stations'}
        }

        Array.from(trains).forEach(train=>{
            const availability = train.avaiblitycache
            const classes = train.avlClasses.Array

            const trainNum = train.trainNumber
            const trainName = train.trainName
            const departureTime = train.departureTime;

            const confrimTrain = {trainName,trainNum,departureTime,availableClasses:{}}
            Array.from(classes).forEach(Class=>{
                const metaData = availability[Class]
                if(availability[Class].PredictionDisplayName == 'Available'){
                    if(!this.confirms.includes(trainNum)){
                        this.confirms.push(trainNum)
                    }
                    const fare = metaData.Fare
                    const available = metaData.Availability
                    confrimTrain.availableClasses[Class] = {available,fare}
                }
            })
            if(this.confirms.includes(trainNum)){
                results.trainsWithConfirmTickets.push(confrimTrain)
            }

        })

        return results
    }
    
}
