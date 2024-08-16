package com.ssafy.readly.util;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import javax.xml.parsers.SAXParserFactory;
import javax.xml.parsers.SAXParser;

import com.ssafy.readly.dto.Book.BookRequest;
import org.xml.sax.helpers.ParserAdapter;
import org.xml.sax.helpers.DefaultHandler;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

class AladdinOpenAPIHandler extends DefaultHandler {
    public List<BookRequest> Items;
    private BookRequest currentItem;
    private boolean inItemElement = false;
    private String tempValue;

    public AladdinOpenAPIHandler() {
        Items = new ArrayList<BookRequest>();
    }

    public void startElement(String namespace, String localName, String qName, Attributes atts) {
        if (localName.equals("item")) {
            currentItem = new BookRequest();
            inItemElement = true;
        } else if (localName.equals("title")) {
            tempValue = "";
        } else if (localName.equals("link")) {
            tempValue = "";
        } else if (localName.equals("author")) {
            tempValue = "";
        } else if (localName.equals("description")) {
            tempValue = "";
        } else if (localName.equals("cover")) {
            tempValue = "";
        } else if (localName.equals("isbn13")) {
            tempValue = "";
        } else if (localName.equals("itemPage")) {
            tempValue = "";
        }
    }

    public void characters(char[] ch, int start, int length) throws SAXException {
        tempValue = tempValue + new String(ch, start, length);
    }
    public void endElement(String namespaceURI, String localName, String qName) {
        if (inItemElement) {
            if (localName.equals("item")) {
                Items.add(currentItem);
                currentItem = null;
                inItemElement = false;
            } else if (localName.equals("title")) {
                currentItem.setTitle(tempValue);
            } else if (localName.equals("link")) {
                currentItem.setPurchaseLink(tempValue);
            } else if (localName.equals("author")) {
                currentItem.setAuthor(tempValue);
            } else if (localName.equals("description")) {
                currentItem.setDescription(tempValue);
            } else if (localName.equals("cover")) {
                currentItem.setImage(tempValue);
            } else if (localName.equals("isbn13")) {
                currentItem.setISBN(tempValue);
            } else if (localName.equals("itemPage")) {
                currentItem.setTotalPage(Integer.parseInt(tempValue));
            }
        }
    }

    public void parseXml(String xmlUrl) throws Exception {
        SAXParserFactory spf = SAXParserFactory.newInstance();
        SAXParser sp = spf.newSAXParser();
        ParserAdapter pa = new ParserAdapter(sp.getParser());
        pa.setContentHandler(this);
        pa.parse(xmlUrl);
    }
}

public class AladdinOpenAPI {

    public static String GetUrl(String index,String BASE_URL,String Results) throws Exception {
        Map<String, String> hm = new HashMap<String, String>();
        hm.put("ttbkey", "ttbbeomsu46390952001");
        //hm.put("Query", URLEncoder.encode(searchWord, "UTF-8"));
        hm.put("QueryType", "Bestseller");
        hm.put("MaxResults", Results);
        hm.put("start", index);
        hm.put("SearchTarget", "Book");
        hm.put("output", "xml");
        hm.put("Version", "20131101");
        StringBuffer sb = new StringBuffer();
        Iterator<String> iter = hm.keySet().iterator();
        while (iter.hasNext()) {
            String key = iter.next();
            String val = hm.get(key);
            sb.append(key).append("=").append(val).append("&");
        }

        return BASE_URL + sb.toString();
    }

    public static String GetUrlDetail(String index,String BASE_URL,String searchISBN) throws Exception {
        Map<String, String> hm = new HashMap<String, String>();
        hm.put("ttbkey", "ttbbeomsu46390952001");
        hm.put("ItemId", searchISBN);
        hm.put("ItemIdType", "ISBN13");
        hm.put("Cover", "Big");
        hm.put("SearchTarget", "Book");
        hm.put("output", "xml");
        hm.put("Version", "20131101");
        StringBuffer sb = new StringBuffer();
        Iterator<String> iter = hm.keySet().iterator();
        while (iter.hasNext()) {
            String key = iter.next();
            String val = hm.get(key);
            sb.append(key).append("=").append(val).append("&");
        }

        return BASE_URL + sb.toString();
    }
    public List<BookRequest> addBooks(int pages, int bookNum) throws Exception {
        List<BookRequest> response = new ArrayList<BookRequest>();
        String BASE_URL = "http://www.aladin.co.kr/ttb/api/ItemList.aspx?";
        String BASE_URL_DETAIL = "http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?";
        for(int i=1;i<=pages;i++){
            String url = GetUrl(String.valueOf(i),BASE_URL, String.valueOf(bookNum));
            //System.out.println(url);
            AladdinOpenAPIHandler api = new AladdinOpenAPIHandler();
            api.parseXml(url);
            //System.out.println(api.Items);
            int count=1;
            for (BookRequest item : api.Items) {
                //System.out.println(item.toString());
                //System.out.println(count++);
                String urlDetail = GetUrlDetail(item.getTitle(),BASE_URL_DETAIL,item.getISBN());
                AladdinOpenAPIHandler api_detail = new AladdinOpenAPIHandler();
                //System.out.println(api_detail);
                api_detail.parseXml(urlDetail);
                for (BookRequest item_detail : api_detail.Items) {
                    response.add(item_detail);
                }
            }

        }
        return response;
    }
}