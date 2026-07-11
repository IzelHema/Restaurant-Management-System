using Microsoft.EntityFrameworkCore;
using RestaurantManagement.API.Models.Entities;

namespace RestaurantManagement.API.Models
{
    public class RestaurantManagementDbContext : DbContext
    {
        public RestaurantManagementDbContext(DbContextOptions<RestaurantManagementDbContext> options)
            : base(options)
        {
        }

        // Tables
        public DbSet<User> Users { get; set; }

        public DbSet<RestaurantTable> RestaurantTables { get; set; }

        public DbSet<WaiterTableAssignment> WaiterTableAssignments { get; set; }

        public DbSet<MenuCategory> MenuCategories { get; set; }

        public DbSet<MenuItem> MenuItems { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderItem> OrderItems { get; set; }

        public DbSet<Bill> Bills { get; set; }

        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // One Waiter -> Many Orders
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.WaiterId)
                .OnDelete(DeleteBehavior.Restrict);

            // One Table -> Many Orders
            modelBuilder.Entity<Order>()
                .HasOne(o => o.RestaurantTable)
                .WithMany()
                .HasForeignKey(o => o.TableId)
                .OnDelete(DeleteBehavior.Restrict);

            // One Order -> Many OrderItems
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId);

            // One Category -> Many MenuItems
            modelBuilder.Entity<MenuItem>()
                .HasOne(mi => mi.MenuCategory)
                .WithMany(mc => mc.MenuItems)
                .HasForeignKey(mi => mi.CategoryId);

            // One Order -> One Bill
            modelBuilder.Entity<Bill>()
                .HasOne(b => b.Order)
                .WithOne()
                .HasForeignKey<Bill>(b => b.OrderId);

            // One Bill -> One Payment
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Bill)
                .WithOne(b => b.Payment)
                .HasForeignKey<Payment>(p => p.BillId);
        }
    }
}