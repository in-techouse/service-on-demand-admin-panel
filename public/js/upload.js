var firebaseConfig = {
  apiKey: "AIzaSyBSwr5h70Hw874WquEuIo56Tse7_xzkYGc",
  authDomain: "services-on-demand-3c3bb.firebaseapp.com",
  databaseURL: "https://services-on-demand-3c3bb.firebaseio.com",
  projectId: "services-on-demand-3c3bb",
  storageBucket: "services-on-demand-3c3bb.appspot.com",
  messagingSenderId: "335038042909",
  appId: "1:335038042909:web:8dfc3b5e26df147a8387f4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$(document).ready(function() {
  console.log("Upload Document is ready");
  $("#submit").prop("disabled", true);
  $("#file").change(function() {
    console.log("File Change");
    readURL(this);
  });

  $("#upload").click(function() {
    $("#progress").show(300);
    console.log("Image Upload Button Clicked");
    var file = document.getElementById("file").files[0];
    let dateTime = new Date().getTime();
    var fileName = dateTime + file.name;
    console.log("File: ", file);
    console.log("Date Tme: ", dateTime);
    console.log("File Name: ", fileName);

    var ref = firebase
      .storage()
      .ref("Admins")
      .child("Category")
      .child(fileName);
    var uploadTask = ref.put(file);
    console.log("File Upload Started");

    uploadTask.on(
      "state_changed",
      function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        progress = progress.toFixed(2);
        $("#progress").html(progress + "% Uploaded.");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      function(error) {
        console.log("Upload Error: ", error);
      },
      function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log("File available at", downloadURL);
          $("#url").val(downloadURL);
          $("#submit").prop("disabled", false);
          $("#upload").hide(300);
        });
      }
    );
  });
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $("#showImage").attr("src", e.target.result);
      $("#upload").show(400);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
