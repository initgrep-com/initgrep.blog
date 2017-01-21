---

---

var data = {};
data.store = {

{% for collection in site.collections %}
{% assign colsname  = collection.label  %}
{% if colsname != 'authors'%} 
{% assign items = site.[colsname] | sort: 'date' | reverse %}
{% for post in items %}
  "{{ post.url | slugify }}": {
    "title": "{{ post.title | xml_escape }}",
    "author": "{{ post.author | xml_escape }}",
    "category": "{{ post.category | xml_escape }}",
    "url": "{{site.baseurl}}{{ post.url | xml_escape }}",
    "meta" : {{ post.meta | strip_html | strip_newlines | jsonify }}
  }
{% unless forloop.last %},{% endunless %}
{% endfor %}
{% unless forloop.last %},{% endunless %}
{%endif%}
{% endfor %}
  

};
