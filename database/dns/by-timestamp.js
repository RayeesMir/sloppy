function(doc) {
	if(doc.match)
		emit(doc.timestamp, doc);
}