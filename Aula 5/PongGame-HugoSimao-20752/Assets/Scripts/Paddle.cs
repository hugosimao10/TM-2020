using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Paddle : MonoBehaviour

{

    public float speed;
    public Rigidbody2D rb;

    private Vector3 StartPosition;

    private float movement;


    // Start is called before the first frame update
    void Start()
    {
        StartPosition = transform.position; // guarda a primeira posição

        
    }

    // Update is called once per frame
    void Update()
    {
        movement = Input.GetAxisRaw("Vertical"); //default, W e S como teclas para o Paddle ir para cima e para baixo
        rb.velocity = new Vector2(rb.velocity.x, movement * speed); // define a velocidade do Paddle
    }

    public void Reset()
    {
        rb.velocity = Vector2.zero; //reset na velocidade
        transform.position = StartPosition; // reset de velocidade para a inicial
    }
}
