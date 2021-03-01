'use strict';
const url = '..'; // change url when uploading to server
// select existing html elements
const addArtForm = document.querySelector('#add-art-form');
const addCommentForm = document.querySelector('#add-comment-form');
const ul = document.querySelector('ul.test');
const div = document.querySelector('div.test2');
const div_mySlides = document.querySelector('div#load_mySlides');
const div_caption = document.querySelector('div.caption-container');
const userLists = document.querySelectorAll('.add-owner');
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#myImgModal img');
const owner = document.querySelector('#owner');
const art_id = document.querySelector('#art_id');
const user_id = document.querySelector('#user_id');
const type = document.querySelector('#co_type');
const close = document.querySelector('#image-modal a');
const cmntContr = document.querySelector('div#cmntContr');
const logOut = document.querySelector('#log-out');
var uid;
var btnHome = document.getElementById('HomeBtn');
var btnArt = document.getElementById('ArtBtn');
var btnUpload = document.getElementById('UpBtn');
var btnAbout = document.getElementById('AboutBtn');
var btnLogout = document.getElementById('LogoutBtn');


// Art slides

function openImgModal() {
  document.getElementById("myImgModal").style.display = "block";
}

function closeImgModal() {
  document.getElementById("myImgModal").style.display = 'none';
}

var slideIndex = 1;
function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
  console.log('currentSlide response', n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  captionText.style.fontSize="40px";
  captionText.style.fontWeight="bolder";
  captionText.style.fontFamily="Garamond, serif";

  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  captionText.innerHTML = dots[slideIndex - 1].alt;
}
// create art cards


function getFileName(str) {
  return str.substring(str.lastIndexOf('/') + 1)
}
const createArtCards = (arts) => {
  // clear ul
  div.innerHTML = '';
  var count = 0;
  arts.forEach((art) => {
    count += 1;
  });
  var i = 1;
  arts.forEach((art) => {
    var num;
    num = i;
    // create li with DOM methods
    const img = document.createElement('img');
    img.src = url + '/thumbnails/' + art.filename;
    img.alt = art.description;
    img.className = "hover-shadow cursor width_img";

    img.classList.add('resp');

    // open large image when clicking image
    img.addEventListener('click', () => {
      openImgModal();
      currentSlide(num);
    });

    const img_div = document.createElement('div');
    img_div.className = "column_img";


    const btnlike = document.createElement('button');
    const btnlikeI = document.createElement('i');
    
    btnlikeI.className = "fa fa-heart-o";
    btnlike.appendChild(btnlikeI);
    btnlike.className = "btn-4";
    if (art.status == 1) {
      btnlike.style.background = "pink";
    }
    else {
      btnlike.style.background = "grey";
    }
   
    btnlike.addEventListener('click', async () => {
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      try {
        var response;
        if (art.status != 1) {
          response = await fetch(url + '/comment/like/' + art.art_id + '/' + sessionStorage.getItem('user_id') + '/' + 1, fetchOptions);

        }
        else {
          response = await fetch(url + '/comment/likeupdate/' + art.art_id + '/' + sessionStorage.getItem('user_id') + '/' + 0, fetchOptions);

        }
        const json = await response.json();
        console.log('like  response', json);
        if (btnHome.className == "active") {
          getArt();
          console.log('Home Active');
        } else {
          getByuserArt(sessionStorage.getItem('user_id'));
        }
      }
      catch (e) {
        console.log(e.message());
      }

    });




    // comment btn
    const btnComment = document.createElement('button');
    btnComment.style.background = "gold"
    const btnCommentI = document.createElement('i');
    btnCommentI.className = "fa fa-comment";
    btnComment.appendChild(btnCommentI);
    btnComment.className = "btn-2";
    btnComment.addEventListener('click', async () => {

      art_id.value = art.art_id;
      getComment(art.art_id);
      openForm_Comment();
    });

    // download btn
    const btnDownload = document.createElement('button');
    btnDownload.style.background = "green"
    const btnDownloadI = document.createElement('i');
    btnDownloadI.className = "fa fa-cloud-download";
    btnDownload.appendChild(btnDownloadI);
    btnDownload.className = "btn-3";
    btnDownload.addEventListener('click', () => {
      let imagePath = url + '/thumbnails/' + art.filename;;
      let fileName = getFileName(imagePath);
      saveAs(imagePath, fileName);
    });

    const btntrash = document.createElement('button');
    btntrash.style.background = "red";
    const btntrashI = document.createElement('i');
    btntrashI.className = "fa fa-trash-o";
    btntrash.appendChild(btntrashI);
    btntrash.className = "btn-4";
    btntrash.addEventListener('click', async () => {
      console.log('delete ', art.art_id);
      const fetchOptions = {
        method: 'delete',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      try {
        const response = await fetch(url + '/art/' + art.art_id, fetchOptions);
        const json = await response.json();
        console.log('delete response', json);
        if (btnHome.className == "active") {
          getArt();
          console.log('Home Active');
        } else {
          getByuserArt(sessionStorage.getItem('user_id'));
        }
      }
      catch (e) {
        console.log(e.message());
      }

    });

    img_div.appendChild(img);
    if (btnHome.className != "active") {
      img_div.appendChild(btntrash);

    }
    else {
      img_div.appendChild(btnlike);
    }
    img_div.appendChild(btnDownload);
    img_div.appendChild(btnComment);
    div.appendChild(img_div);

    const mySlidesdiv = document.createElement('div');
    mySlidesdiv.className = "mySlides";
    const numbertextdiv = document.createElement('div');
    numbertextdiv.className = "numbertext";
    numbertextdiv.innerHTML = i + '/' + count;

    const img2 = document.createElement('img');
    img2.src = url + '/thumbnails/' + art.filename;
    img2.alt = art.description;
    img2.className = "width_img";

    mySlidesdiv.appendChild(numbertextdiv);
    mySlidesdiv.appendChild(img2);
    div_mySlides.appendChild(mySlidesdiv);
    i += 1;
  });


  i = 1;

  arts.forEach((art) => {
    var num;
    num = i;
    const columndiv = document.createElement('div');
    columndiv.className = "column_img";

    const img3 = document.createElement('img');
    img3.src = url + '/thumbnails/' + art.filename;
    img3.alt = art.description;
    img3.className = "demo cursor width_img";

    img3.addEventListener("click", function () {
      currentSlide(num);
      console.log('currentSlide', num);
    }, false);

    columndiv.appendChild(img3);

    div_mySlides.appendChild(columndiv);
    i += 1;
  });
};

// AJAX call

const getByuserArt = async (uid) => {
  console.log('getArt token ', sessionStorage.getItem('token'));
  try {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/art/art/' + uid, options);
    const arts = await response.json();
    createArtCards(arts);
    showSlides(slideIndex);
  }
  catch (e) {
    console.log(e.message);
  }
};


const getArt = async () => {
  console.log('getArt token ', sessionStorage.getItem('token'));
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const uid = sessionStorage.getItem('user_id')
    const response = await fetch(url + '/art/getart/'+uid, options);
    const arts = await response.json();
    createArtCards(arts);
    showSlides(slideIndex);
  }
  catch (e) {
    console.log(e.message);
  }
};

const createCommentCards = (comments) => {

  comments.forEach((comment) => {
    const ElementDiv = document.createElement('div');
    ElementDiv.className = "dis_comment";
    const ElementP = document.createElement('h2');

    ElementP.className = "left";
    ElementP.innerHTML = comment.owner_name;
    ElementP.style.color = "blue";


    const ElementP1 = document.createElement('p');
    ElementP1.className = "left";
    ElementP1.innerHTML = comment.comment;
    ElementP1.style.fontWeight = "bolder"

    ElementDiv.appendChild(ElementP);
    ElementDiv.appendChild(ElementP1);

    cmntContr.appendChild(ElementDiv);
  });

};

const getComment = async (id) => {
  console.log('getComment token', sessionStorage.getItem('token'));
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/comment/' + id, options);
    const comments = await response.json();
    createCommentCards(comments);
  }
  catch (e) {
    console.log(e.message);
  }
};


// add art
addArtForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(addArtForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/art', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  if (btnHome.className == "active") {
    getArt();
    console.log('Home Active');
  } else {
    getByuserArt(sessionStorage.getItem('user_id'));
  }
});


// add comment
addCommentForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = serializeJson(addCommentForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: JSON.stringify(fd),
  };
  const response = await fetch(url + '/comment', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  if (btnHome.className == "active") {
    getArt();
    console.log('Home Active');
  } else {
    getByuserArt(sessionStorage.getItem('user_id'));
  }
  getComment(art_id.value)
});
// logout
logOut.addEventListener('click', async (evt) => {
  evt.preventDefault();
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/auth/logout', options);
    const json = await response.json();
    console.log(json);
    // remove token
    sessionStorage.removeItem('token');
    alert('You have logged out');
    window.location = "./index.html";
  }
  catch (e) {
    console.log(e.message);
  }
});

// create user options to <select>
const createUserOptions = (users) => {
  userLists.forEach((list) => {
    // clear user list
    list.innerHTML = '';
    users.forEach((user) => {
      // create options with DOM methods
      const option = document.createElement('option');
      option.value = user.user_id;
      option.innerHTML = user.name;
      option.classList.add('light-border');
      list.appendChild(option);
    });
  });
};

// get users to form options
const getUsers = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/user', options);
    const users = await response.json();
    createUserOptions(users);
  }
  catch (e) {
    console.log(e.message);
  }
};


// when app starts, check if token exists and hide login form, show logout button and main content, get arts and users
if (sessionStorage.getItem('token')) {
  owner.value = sessionStorage.getItem('user_id');
  console.log("user id", sessionStorage.getItem('user_id'));
  if (btnHome.className == "active") {
    getArt();
    console.log('Home Active');
  } else {
    getByuserArt(sessionStorage.getItem('user_id'));
  }

}
else {
  window.location = "./index.html";
}


function openForm_new() {
  document.getElementById("myForm1").style.display = "block";
}

function closeForm_new() {
  document.getElementById("myForm1").style.display = "none";
}


function openForm_Comment() {
  user_id.value = sessionStorage.getItem('user_id');
  type.value = 0;
  document.getElementById("myFormComment").style.display = "block";
}

function closeForm_Comment() {
  document.getElementById("myFormComment").style.display = "none";
}




btnHome.addEventListener('click', function (e) {
  getArt();
  btnHome.className = "active";
  btnArt.className = "";
  btnUpload.className = "";

  btnLogout.className = "";
});


btnArt.addEventListener('click', function (e) {
  getByuserArt(sessionStorage.getItem('user_id'));
  btnArt.className = "active";
  btnHome.className = "";
  btnUpload.className = "";

  btnLogout.className = "";
});

btnUpload.addEventListener('click', function (e) {
  btnHome.className = "";
  btnArt.className = "";
  btnUpload.className = "active";

  btnLogout.className = "";
});


btnLogout.addEventListener('click', function (e) {
  btnHome.className = "";
  btnArt.className = "";
  btnUpload.className = "";

  btnLogout.className = "active";
});
