
var pageList = {
	pages: [], 
	addPage: function(pageid, title, extract, url){
		 this.pages.push({
        pageid: pageid,
			  title: title,
			  extract: extract,
			  url: url
		  });
	  },
   clear: function(){
     this.pages.splice(0, this.pages.length);
  }
};	

var controller = {
  
  search: function(searchWord){ 
    pageList.clear();
    view.clearList();
    var apiURL = 'https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&generator=search&gsrlimit=10&prop=extracts&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=' + searchWord; 
    var request = new XMLHttpRequest();
    request.open('GET', apiURL, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400)  { // Success!
        var data = JSON.parse(request.response);
        var results = data.query.pages; 
        var pageIds= Object.getOwnPropertyNames(results);
       	 pageIds.forEach(function(id){
            var wiki_url = 'https://en.wikipedia.org/?curid=' + id;
       	    pageList.addPage(id, results[id].title, results[id].extract, wiki_url);
         });
         view.displayPages();

      }else{
      }
    };
    request.onerror = function() {
    };
    request.send();
    
   
    
  }    
};

var view = {
	displayPages: function(){
    document.getElementById("wikipedia-logo").className="transformWikiImg";
    var pageUl = document.getElementById("pageList");
    
    pageList.pages.forEach(function(page){
      var anchor = document.createElement("a");
      anchor.href = page.url;
      anchor.target = "_blank";
      var pageLi = document.createElement("li");
      var h3 = document.createElement("h3");               
      h3.textContent = page.title;
      var paragraph = document.createElement("p");
      paragraph.textContent = page.extract;
      
      pageUl.appendChild(anchor);
      anchor.appendChild(pageLi);
      pageLi.appendChild(h3);
      pageLi.appendChild(paragraph);
    });
	},
  
  clearList: function(){
  document.getElementById("pageList").innerHTML='';
  },
	setUpEventListeners: function(){
    document.getElementById("searchForm").addEventListener("submit", function(event){
      event.preventDefault(); 
      var searchInput = document.getElementById("searchInput").value;
      controller.search(searchInput);   
    });
  }
  
  
};

view.setUpEventListeners();