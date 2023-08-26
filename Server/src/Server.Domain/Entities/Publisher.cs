﻿// ReSharper disable CollectionNeverUpdated.Global

#pragma warning disable CS8618

namespace Server.Domain.Entities;

public class Publisher
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string? LogoLink { get; set; }
    public ICollection<Book> Books { get; set; }

    public static Publisher Create(Guid id, string name, string? description, string? logoLink)
        => new()
        {
            Id = id,
            Name = name,
            Description = description,
            LogoLink = logoLink,
            Books = new List<Book>()
        };
}