namespace API.RequestHelpers;

public class PaginationParams {
    public const int MAX_PAGE_SIZE = 50;

    public int PageNumber { get; set; } = 1;

    private int _pageSize = 6;

    public int PageSize {
        get => _pageSize;
        set => _pageSize = value <= MAX_PAGE_SIZE ? value : MAX_PAGE_SIZE;
    }
}
