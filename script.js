$(document).ready(function(){

    var config = {
        apiKey: "AIzaSyBsXxBHrDIIeSD-iyFh2Z9YZzszmZ2jwnA",
        authDomain: "traintracker-c4f7c.firebaseapp.com",
        databaseURL: "https://traintracker-c4f7c.firebaseio.com",
        projectId: "traintracker-c4f7c",
        storageBucket: "traintracker-c4f7c.appspot.com",
        messagingSenderId: "480353054239"
      };
      firebase.initializeApp(config);

      database = firebase.database();

      database.ref().on("value",function(snapshot){
        snap = snapshot.val();
        $("#trainsTable").html("<tr><th>Train Name</th><th>Destination</th>        <th>Frequency (Minutes)</th>        <th>Next Arrival</th>        <th>Minutes Away</th>    </tr>");
        snapshot.forEach(function(childSnap){
            // console.log(childSnap.val());
            
            let trainNameIn = childSnap.val().trainNameDB;
            let trainDestinationIn = childSnap.val().trainDestinationDB;
            let firstTrainTimeIn = childSnap.val().firstTrainTimeDB;
            let trainFrequencyIn = childSnap.val().trainFrequencyDB;

            let nowTimeH = parseInt(moment().format("HH"));
            let nowTimeM = parseInt(moment().format("mm"));
            // console.log(nowTimeH+":"+nowTimeM);
            // console.log("hours =",nowTimeH)
            let unixNow = (nowTimeH*60)+nowTimeM;
            unixNow = parseInt(unixNow)
            // console.log(unixNow)
            // console.log(moment().diff(firstTrainTimeIn));

            let splitArrival = firstTrainTimeIn.split(":");
            // console.log(splitArrival);
            let unixArrival = parseInt((splitArrival[0]*60))+parseInt(splitArrival[1]);
            // console.log(unixArrival);

            let nextArrival = 0;
            let minutesAway = 0;

            unixArrival = parseInt(unixArrival);
            trainFrequencyIn = parseInt(trainFrequencyIn)
            
            console.log(unixArrival, unixNow, trainFrequencyIn);
            
            // unixArrival = checkNextTime(unixArrival, unixNow, trainFrequencyIn);
            
            while (unixArrival<unixNow){

                unixArrival = unixArrival+trainFrequencyIn;
            }

            minutesAway = unixArrival-unixNow;

            nextArrivalUnix = unixNow+minutesAway;
            nextArrivalH = 0;

            while (nextArrivalUnix>60){
                nextArrivalH++;
                nextArrivalUnix = nextArrivalUnix-60;
            }

            nextArrival = nextArrivalH+":"+nextArrivalUnix

            // if (nowTime.toNow)


            let newTrainRow = ('<tr><td>'+trainNameIn+'</td><td>'+trainDestinationIn+'</td><td>'+trainFrequencyIn+'</td><td>'+nextArrival+'</td><td>'+minutesAway+'</td></tr>');
            $("#trainsTable").append(newTrainRow);

        });
      });

    //   function checkNextTime(next, now, interval){               this is a recursive function I built
    //       console.log("running the check",next,now)              when I was having trouble with my while loop
    //       if (next>now){
    //           console.log(next,"is biggerthan",now);
              
    //           return next;
    //       }else{                                                         it works, but takes FOREVER
    //           next = next + interval;
    //           console.log("adding",interval,"and trying again")
    //           return checkNextTime(next, now, interval);
    //       }
    //   }

      function convertToUnix(D, M, Y){
        let secondsYear = (Y-2018)*(31536000 + 21600);
        console.log(secondsYear);
        let secondsMonth = (M-1) * (2628000);
        console.log(secondsMonth);
        let secondsDay = (D-1) * (86400);
        console.log(secondsDay);
        return (secondsDay+secondsMonth+secondsYear)/2628000;
      }

    $("#submitButton").on("click",function(){
        let inName = $("#trainName").val();
        let inDestination = $("#trainDestination").val();
        let inFirstTime = $("#firstTrainTime").val();
        let inFrequency = $("#trainFrequency").val();

        database.ref().push({
            trainNameDB: inName,
            trainDestinationDB: inDestination,
            firstTrainTimeDB: inFirstTime,
            trainFrequencyDB: inFrequency
        });

        $("#trainName").val() = ""
        $("#trainDestination").val() = ""
        $("#firstTrainTime").val() = ""
        $("#trainFrequency").val() = ""
    });









});