
# MyHanaApp - A sample SAP CAP application

https://developers.sap.com/group.hana-cloud-cap-setup.html

https://learning.sap.com/learning-journeys/installing-and-administering-sap-hana/illustrating-deployment-options

https://community.sap.com/t5/technology-blog-posts-by-sap/sap-cloud-platform-backend-service-overview-of-blogs/ba-p/13390923



## GIT - Add Repository- Creating a new repository


To create a new Git repository, run the following commands:

git init

git add .

git commit -m "Initial App changes Commit"

git branch -M master/main

git remote add origin  https://

git push -f origin master/main


# Create database entities

![alt text](images/images26.png)

# # Understanding the Difference between association and composition in cds 

In CDS, associations are defined using the `Association` keyword, while compositions are defined using the `Composition` keyword. This syntactical difference highlights their functional distinctions in terms of ownership and lifecycle management.

## Key Differences
- Associations allow entities to reference each other without ownership, while compositions imply ownership and lifecycle dependency.\n- In associations, child entities can exist independently of the parent, whereas in compositions, child entities are deleted if the parent is deleted.\n- Associations are defined with the `Association` keyword and compositions with the `Composition` keyword in CDS.

In CDS, associations are used for loosely coupled relationships, while compositions are used for tightly coupled relationships where ownership and lifecycle are important.

Understanding these differences helps in structuring your data models effectively, ensuring data integrity and appropriate handling of related entities.

![alt text](images/image.png)

![alt text](images/image-1.png)


*************************************************************************************
# # managed and unmanaged associations in sap capm

![alt text](images/image31.png)

https://community.sap.com/t5/technology-blog-posts-by-sap/sap-cloud-platform-backend-service-tutorial-4-cds-how-to-define/ba-p/13393353

Unmanaged Associations
Unmanaged associations specify arbitrary join conditions in their on clause, which refer to available foreign key elements. The association's name (address in the following example) is used as the alias for the to-be-joined target entity.


entity Employees {

  address : Association to Addresses on address.ID = address_ID;

  address_ID : Integer;  //> foreign key

}

entity Addresses {

  key ID : Integer;

}
Managed (To-One) Associations
For to-one associations, CDS can automatically resolve and add requisite foreign key elements from the target's primary keys and implicitly add respective join conditions.


entity Employees {

  address : Association to Addresses;

}
This example is equivalent to the unmanaged example above, with the foreign key element address_ID being added automatically upon activation to a SQL database. The names of the automatically added foreign key elements cannot be changed.

Note: For adding foreign key constraints on database level, see Database Constraints..

If the target has a single primary key, a default value can be provided. This default applies to the generated foreign key element address_ID:


entity Employees {

  address : Association to Addresses default 17;

}
To-many Associations
For to-many associations specify an on condition following the canonical expression pattern <assoc>.<backlink> = $self as in this example:


entity Employees {

  key ID : Integer;

  addresses : Association to many Addresses

    on addresses.owner = $self;

}

entity Addresses {

  owner : Association to Employees;  //> the backlink

}
The backlink can be any managed to-one association on the many side pointing back to the one side.

Many-to-many Associations

For many-to-many association, follow the common practice of resolving logical many-to-many relationships into two one-to-many associations using a link entity to connect both. For example:


entity Employees { [...]

  addresses : Association to many Emp2Addr on addresses.emp = $self;

}
entity Emp2Addr {

  key emp : Association to Employees;

  key adr : Association to Addresses;

}
Learn more about Managed Compositions for Many-to-many Relationships.

Compositions
Compositions constitute document structures through contained-in relationships. They frequently show up in to-many header-child scenarios.


entity Orders {

  key ID: Integer; //...

  Items : Composition of many Orders.Items on Items.parent = $self;

}
entity Orders.Items {

  key pos : Integer;

  key parent : Association to Orders;

  product : Association to Products;

  quantity : Integer;

}
Contained-in relationship

Essentially, Compositions are the same as associations, just with the additional information that this association represents a contained-in relationship so the same syntax and rules apply in their base form.

Limitations of Compositions of one

Using compositions of one for entities is discouraged. There is often no added value of using them as the information can be placed in the root entity. Compositions of one have limitations as follow:

Very limited Draft support. Fiori elements does not support compositions of one unless you take care of their creation in a custom handler.
No extensive support for modifications over paths if compositions of one are involved. You must fill in foreign keys manually in a custom handler.

Managed Compositions of Aspects
Use managed compositions variant to nicely reflect document structures in your domain models, without the need for separate entities, reverse associations, and unmanaged on conditions.

With Inline Targets

entity Orders {
  key ID: Integer; //...
  Items : Composition of many {
    key pos : Integer;
    product : Association to Products;
    quantity : Integer;
  }
};
Managed Compositions are mostly syntactical sugar: Behind the scenes, they are unfolded to the unmanaged equivalent as shown above by automatically adding a new entity, the name of which being constructed as a scoped name from the name of parent entity, followed by the name of the composition element, that is Orders.Items in the previous example. You can safely use this name at other places, for example to define an association to the generated child entity:


entity Orders {
  // …
  specialItem : Association to Orders.Items;
};
With Named Targets
Instead of anonymous target aspects you can also specify named aspects, which are unfolded the same way as anonymous inner types, as shown in the previous example:


entity Orders {
  key ID: Integer; //...
  Items : Composition of many OrderItems;
}
aspect OrderItems {
  key pos : Integer;
  product : Association to Products;
  quantity : Integer;
}
Default Target Cardinality
If not otherwise specified, a managed composition of an aspect has the default target cardinality to-one.

For Many-to-many Relationships
Managed Compositions are handy for many-to-many relationships, where a link table usually is private to one side.


entity Teams { [...]
  members : Composition of many { key user: Association to Users; }
}
entity Users { [...]
  teams: Association to many Teams.members on teams.user = $self;
}
And here's an example of an attributed many-to-many relationship:


entity Teams { [...]
  members : Composition of many {
    key user : Association to Users;
    role : String enum { Lead; Member; Collaborator; }
  }
}
entity Users { ... }
To navigate between Teams and Users, you have to follow two associations: members.user or teams.up_. In OData, to get all users of all teams, use a query like the following:


GET /Teams?$expand=members($expand=user)

Managed and unmanaged associations in SAP CAPM differ in how they handle foreign keys: managed associations automatically create and manage foreign key fields, while unmanaged associations require you to explicitly define the join condition using an on clause. A managed association is simpler as it handles the foreign key and join logic for you, whereas an unmanaged one provides more control for complex relationships or when you want to avoid the automatic creation of foreign key fields. 
Managed Association
What it is: The CAPM framework automatically creates the necessary foreign key fields and join conditions behind the scenes based on the primary keys of the associated entities.
When to use: Use for simple, straightforward relationships where the standard foreign key setup is sufficient.

Example:
cds
namespace my.bookshop;


entity Books {
  key ID : Integer;

  title  : String;

  author : Association to Authors; // Managed association

}

entity Authors {
  key ID : Integer;

  name   : String;

  books  : Association to many Books;

}

Behind the scenes: CAP adds an author_ID field to the Books table and automatically creates the JOIN condition in queries. 

Unmanaged Association

What it is: You must explicitly define the join condition using an on clause, referencing existing elements in the entities.
When to use: Use when you need more control over the join logic, for complex relationships, or when you don't want the framework to automatically generate a foreign key field.
Example:

cds
namespace my.bookshop;

entity Books {
  key ID : Integer;

  title  : String;
  // Unmanaged association to authors, based on a specific field

  author : Association to Authors on author.ID = book_author_ID;

  book_author_ID : String; // Foreign key is explicitly declared
}

entity Authors {
  key ID : String; // Note the ID type is now String to match the unmanaged association's join key
  
  name   : String;

}

Behind the scenes: The on condition author.ID = book_author_ID specifies the exact join logic, and the book_author_ID field is used instead of an automatically generated one. 

![alt text](images/image30.png)


## Deploy db CDS to hana cloud

To deploy your CDS model to SAP HANA Cloud, follow these steps:
1. Ensure you have the SAP HANA Cloud CLI installed and configured.
2. Navigate to your project directory in the terminal.
3. Run the command `cds deploy --to hana` to deploy your CDS model.
4. Monitor the deployment process for any errors.
5. Once deployment is successful, verify your model in the SAP HANA Cloud cockpit.

6. Test your deployed CDS model by querying the entities using the SAP HANA Cloud database tools or through your application.


1) cds build

 ![alt text](images/image2.png)
 

2) cds deploy 

   ![alt text](images/image3.png)

   ![alt text](images/image4.png)

   ![alt text](images/image5.png)

   ![alt text](images/image6.png)

   ![alt text](images/image7.png)

   ![alt text](images/image8.png)

   ![alt text](images/image9.png)

   ![alt text](images/image10.png)

   ![alt text](images/image11.png)

   ![alt text](images/image12.png)

   ![alt text]( images/image13.png)

   
## Validate  CDS Tables in HANA Cloud

![alt text]( images/image14.png)

   ![alt text](images/image15.png)

   ![alt text]( images/image16.png)

   ![alt text](images/image17.png)

   ![alt text](images/image18.png)

   ![alt text](images/image19.png)

   ![alt text](images/image20.png)

   ![alt text](images/image21.png)

   ![alt text](images/image22.png)

   ![alt text](images/image23.png)

   ![alt text](images/image24.png)

   ![alt text](images/image25.png)

    ![alt text]( images/image28.png)


# # diff between binding of HDI Container vs deploy cds to hana in sap capm

![alt text](images/image29.png)



# # Create service interface

In the srv (**not src!**) folder create another file and name it interaction_srv.cds

![alt text](images/image27.png)

# # Check data loaded into the tables

# App Router Modules

Ensure the App Router is configured to connect to the HANA database and the necessary routes are defined for accessing the CDS services.
In the `app/router` folder, create a new file named `routes.js` and define the routes for your services. Make sure to include the necessary authentication and authorization middleware to secure your endpoints.

https://www.npmjs.com/package/@sap/approuter

To install the SAP Cloud Application Programming Model (CAP) and set up your project, follow the instructions in the official documentation. Make sure to include the necessary packages such as `@sap/cds`, `@sap/approuter`, and any other dependencies required for your application.

# # 
Among other information, this configuration is declaring that requests containing the pattern ^/(.*)$ are routed to a destination called srv-api. This destination was defined by the wizard in the mta.yaml file and points the service layer of our CAP application.

# Create a Fiori web interface

We want to create a Fiori UI for our CAP service. We will use the wizards to generate most of the UI.

From the top menu select View -> Command Pallette. Then type fiori into the search box. Select Fiori Open Application Generator.

##

using CatalogService as service from '../../srv/interaction_srv';

annotate service.Interactions_Header with @(

    UI.FieldGroup #GeneratedGroup : {

        $Type : 'UI.FieldGroupType',

        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'partner',
                Value : partner,
            },
            {
                $Type : 'UI.DataField',
                Label : 'country_code',
                Value : country_code,
            },
        ],

    },

    UI.Facets : [

        {

            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',

        },

    ],

    UI.LineItem : [

        {
            $Type : 'UI.DataField',
            Label : 'partner',
            Value : partner,

        },
        {

            $Type : 'UI.DataField',
            Label : 'country_code',
            Value : country_code,

        },

    ],
    
);

## Add User Authentication to Your Application

The UAA will provide user identity, as well as assigned roles and user attributes

In SAP CAPM, user attributes are primarily managed and accessed through the integration with the SAP Authorization and Trust Management Service (XSUAA) and the Application Router.

1. Adding User Attributes:

User attributes in CAPM are not directly "added" within the CAPM application code itself in the same way you might add fields to a database table. Instead, they are typically:

Configured in the Identity Provider (IdP): If you are using a corporate IdP (like SAP Cloud Identity Services or a custom SAML/OIDC provider), user attributes (e.g., email, first name, last name, custom attributes) are defined and managed within that IdP.

Mapped in XSUAA: When integrating with XSUAA, you can configure attribute mappings in the xs-security.json file of your CAPM application. This defines how attributes from your IdP are mapped to XSUAA attributes that your CAPM application can then consume.

    {
      "xsappname": "mycapmapp",
      "tenant-mode": "dedicated",
      "scopes": [
        // ...
      ],
      "attributes": [
        {
          "name": "email",
          "description": "User's email address",
          "value-type": "string"
        },
        {
          "name": "custom_attribute",
          "description": "A custom user attribute",
          "value-type": "string"
        }
      ],
      "role-templates": [
        {
          "name": "Viewer",
          "description": "View access",
          "scope-references": [
            "$XSAPPNAME.Viewer"
          ],
          "attribute-references": [
            "email",
            "custom_attribute"
          ]
        }
      ]
    }

    Assigned via Role Collections: In the SAP BTP cockpit, administrators assign users to role collections. These role collections are based on role templates defined in xs-security.json and can include references to the defined user attributes. When a user is assigned a role collection, the corresponding attribute values from the IdP are associated with that user's session.

2. Fetching User Attributes in CAPM:

You can fetch user attributes within your CAPM service using the req.user object, which is an instance of cds.User.

Example:
Consider a CAPM service with the following user-info-service.js:

const cds = require('@sap/cds');

module.exports = async (srv) => {
    srv.on('userInfo', async (req) => {
        const user = req.user;
        const email = user.id; // XSUAA often uses email as the user ID
        const firstName = user.attr.givenName; // Access attributes mapped in xs-security.json
        const lastName = user.attr.familyName;
        const customAttribute = user.attr.custom_attribute; // Access custom attributes

        return {
            id: user.id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            customAttribute: customAttribute,
            isAuthenticated: user.isAuthenticated(),
            isAdministrator: user.is('Admin') // Check if user has a specific role
        };
    });
};

In this example:

req.user.id typically provides the user's principal identifier (often their email address or a unique ID from the IdP).

req.user.attr.<attribute_name> allows you to access specific attributes that were mapped in xs-security.json and populated from the IdP.

user.isAuthenticated() and user.is('RoleName') are helpful methods for basic authentication and authorization checks.

service UserInfoService {
    function userInfo() returns {
        id: String;
        email: String;
        firstName: String;
        lastName: String;
        customAttribute: String;
        isAuthenticated: Boolean;
        isAdministrator: Boolean;
    };
}

When a request comes into your CAPM service via the Application Router and XSUAA, the req.user object will be populated with the authenticated user's information, including the mapped attributes.

https://community.sap.com/t5/technology-blog-posts-by-sap/identity-provisioning-service-ips-assigning-custom-attributes-to-ias-users/ba-p/14189767

To map attributes from your Identity Provider (IdP) to XSUAA and consume them in your CAP application, you need to define the attributes in the XSUAA security descriptor, configure the IdP to expose them, and then map them in the BTP cockpit. The CAP application will then receive these attributes in the user's JSON Web Token (JWT). 
Example Scenario

You want to restrict access to certain data in your CAP application based on the user's country. The user's country is stored as a custom attribute custom_country in your corporate IdP (e.g., SAP Identity Authentication Service - IAS). 

1. Define the attribute in xs-security.json

In your CAP project's xs-security.json file, define the custom attribute under the attributes section:

{
  "xsappname": "my-cap-app",
  "tenant-mode": "dedicated",
  "scopes": [
    // ... standard scopes
  ],
  "attributes": [
    {
      "name": "Country",
      "description": "User's Country for access control",
      "valueType": "string",
      "valueRequired": false
    }
  ],
  "role-templates": [
    {
      "name": "CountrySpecificRole",
      "description": "Role with country attribute",
      "scope-references": [
        // ... scope references
      ],
      "attribute-references": [
        "Country"
      ]
    }
  ]
}

After updating, you must recreate and rebind your XSUAA service instance with the updated configuration for the changes to take effect. 
2. Configure the IdP to expose the attribute
In your Identity Provider (e.g., SAP IAS tenant):
Navigate to the Applications section and select the application corresponding to your BTP subaccount.
Go to the Assertion Attributes tab (or equivalent, depending on the IdP).
Add a new SAML assertion attribute with the name that matches your IdP's user store (e.g., custom_country or Country).
Map this attribute to the relevant user attribute in the IdP's user store (e.g., country from the corporate user store). 
3. Map the IdP attribute to the XSUAA attribute
In the SAP BTP cockpit for your subaccount:
Navigate to Security > Role Collections.
Create a new role collection (e.g., CAP_Country_RoleCollection).
In the role collection, map the IdP attribute value to the XSUAA attribute value. For example, you can create a condition that assigns this role collection if the user attribute Country from the IdP has the value USA. 
4. Consume the attribute in the CAP application
The CAP application receives the user's information, including the assigned roles with their attribute values, in a JWT. You can access this information in your application's backend logic (Node.js or Java) to perform dynamic or instance-based authorization checks. 
Example (Node.js):
You can use the @sap/cds-security package to access user information.

srv.on('READ', 'Risks', async (req) => {

    const user = req.user; // User object from the JWT
    const country = user.attr.Country; // Access the "Country" attribute
    
    if (country === 'USA') {
        // Apply specific logic for US users
        return await cds.run(SELECT.from('Risks').where({ impact: 'High' }));
    } else {
        // Apply logic for other users
        return await cds.run(SELECT.from('Risks'));
    }

});

https://help.sap.com/docs/cloud-identity-services/cloud-identity-services/configure-user-attributes-sent-to-application
In the JWT, you can also access other attributes assigned to the user, enabling you to implement fine-grained access control based on different user roles and attributes. Always ensure to validate and sanitize the user input to prevent security vulnerabilities.

To ensure proper access control, you can implement checks based on user roles and attributes, allowing for tailored responses and data handling depending on the user's identity and permissions.

 For more details on JWT and user attributes, refer to the official SAP documentation on Cloud Identity Services.

cds compile srv/ --to xsuaa > xs-security.json

CLI cf create-service-key MyHANAApp-auth myServiceKey
cf create-service xsuaa application MyHANAApp-auth -c xs-security.json

cds bind -2 cap_MyHANAApp-auth:default

## Create Calculation View and Expose via CAP (SAP HANA Cloud)

npm install -g hana-cli

hana-cli inspectView -v V_INTERACTION -o cds 



























   







