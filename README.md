
Difference between association and composition in cds 

In CDS, associations are defined using the `Association` keyword, while compositions are defined using the `Composition` keyword. This syntactical difference highlights their functional distinctions in terms of ownership and lifecycle management.

## Key Differences
- Associations allow entities to reference each other without ownership, while compositions imply ownership and lifecycle dependency.\n- In associations, child entities can exist independently of the parent, whereas in compositions, child entities are deleted if the parent is deleted.\n- Associations are defined with the `Association` keyword and compositions with the `Composition` keyword in CDS.

In CDS, associations are used for loosely coupled relationships, while compositions are used for tightly coupled relationships where ownership and lifecycle are important.

Understanding these differences helps in structuring your data models effectively, ensuring data integrity and appropriate handling of related entities.


![alt text](image.png)