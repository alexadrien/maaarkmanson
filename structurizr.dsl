workspace {

    model {
        user = person "User" "Human going to MaaarkManson.net"
        openAI = softwareSystem "OpenAI API" "" "external"
        ss = softwareSystem "Maaark Manson Software System" {
            front = container "Front-End" "React application living in the web browser of the user." "React, LangChainJS" "front"
            function = container "Search Function" "Netlify Function responsible to query a Pinecone DB to get Mark Manson's content from DB" "Netlify" "back"
            db = container "Pinecone DB" "Pinecone Vectorial Database used to store content from Mark Manson's data" "Pinecone" "db"
        }

        user -> front "maaarkmanson.net"
        front -> function "Search for the most relevant piece of information related to the last user message"
        front -> openAI "Query completion api"
        function -> db "Query Vectorial Database Service"
        function -> openAI "Use OpenAI Embedding service to get the vector value of the last user message"
    }

    views {
        container ss {
            include *
            autoLayout
        }

        theme default
        styles {
            element db {
                shape "Cylinder"
            }
            element front {
                shape "Component"
            }
            element back {
                shape "WebBrowser"
            }
        }
    }

}